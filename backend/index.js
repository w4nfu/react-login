const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db = require("./db");
const cookieParser = require("cookie-parser");

const app = express();

const jwtSecretKey = "leewanfu"; // In production, store this securely

const corsOptions = {
    origin: 'http://localhost:3000', // Adjust the frontend URL if needed
    credentials: true // Allow credentials to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
    res.send("Back end server is running.");
});

app.get("/check-mysql", async (_req, res) => {
    try {
        const connection = await db.getConnection();
        await connection.ping();
        connection.release();
        res.status(200).json({ message: "MySQL is connected" });
    } catch (error) {
        console.error("Error checking MySQL connection:", error);
        res.status(500).json({ message: "Error checking MySQL connection" });
    }
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await db.getConnection();

        // Check if the user already exists in the database
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length > 0) {
            // User already exists
            res.status(409).json({ message: "Username already exists" });
        } else {
            // Create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            await connection.execute(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword]
            );

            res.status(201).json({ message: "Account registered successfully!" });
        }

        connection.release();
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/auth", async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await db.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            res.status(401).json({ message: "Wrong username or password" });
        } else {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // Generate a new token
                const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: '20m' });

                // Set the cookie with the new token
                res.cookie('sessionID', token, {
                    maxAge: 20 * 60 * 1000, // 20 minutes
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Set to true in production
                    sameSite: 'Lax'
                });

                res.status(200).json({ message: "success", token });
            } else {
                res.status(401).json({ message: "Wrong username or password" });
            }
        }

        connection.release();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/verify", (req, res) => {
    const authToken = req.cookies['sessionID']; // Get token from cookie

    try {
        const verified = jwt.verify(authToken, jwtSecretKey);
        if (verified) {
            return res.status(200).json({ status: "logged in", message: "success" });
        } else {
            return res.status(401).json({ status: "invalid auth", message: "error" });
        }
    } catch (error) {
        return res.status(401).json({ status: "invalid auth", message: "error" });
    }
});

app.post("/update-password", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await db.getConnection();
        await connection.execute(
            'UPDATE users SET password = ? WHERE username = ?',
            [hashedPassword, username]
        );
        connection.release();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ success: false, message: "Failed to update password" });
    }
});

app.post("/order", async (req, res) => {
    const { username, pizzas, deliveryAddress } = req.body;
    const deliveryFee = deliveryAddress ? 5.00 : 0.00;
    try {
        const connection = await db.getConnection();
        const [user] = await connection.execute('SELECT username FROM users WHERE username = ?', [username]);
        if (user.length === 0) {
            res.status(400).json({ message: "User not found" });
        } else {
            let totalPrice = deliveryFee;
            pizzas.forEach(pizza => {
                totalPrice += pizza.price * pizza.quantity;
            });
            totalPrice = parseFloat(totalPrice.toFixed(2));  // Ensure the total price is formatted to 2 decimal places
            await connection.execute(
                'INSERT INTO orders (username, pizzas, delivery_address, total_price) VALUES (?, ?, ?, ?)', 
                [username, JSON.stringify(pizzas), deliveryAddress, totalPrice]
            );
            res.status(201).json({ message: "Order placed successfully!" });
        }
        connection.release();
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie('sessionID', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    });
    res.status(200).json({ message: "Logged out successfully" });
});

app.listen(3080, () => {
    console.log("Server is running on port 3080");
});