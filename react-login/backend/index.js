const express = require("express");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const serviceAccount = require("./password-manager-5fe19-firebase-adminsdk-glbpt-73bf9efd3d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();

const jwtSecretKey = "leewanfu";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Back end server is running.");
});

app.get("/check-firestore", async (req, res) => {
    try {
        // Query Firestore for a list of collections
        const collections = await db.listCollections();
        
        // Check if collections exist
        if (collections.length > 0) {
            res.status(200).json({ message: "Firestore is connected" });
        } else {
            res.status(500).json({ message: "Firestore is not connected" });
        }
    } catch (error) {
        console.error("Error checking Firestore connection:", error);
        res.status(500).json({ message: "Error checking Firestore connection" });
    }
});

app.post("/auth", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the user exists in Firestore
      const userDoc = await db.collection("users").where("username", "==", username).get();
  
      if (!userDoc.exists) {
        // User not found, create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").doc(username).set({
          password: hashedPassword
        });
  
        const token = jwt.sign({ username }, jwtSecretKey);
        res.status(200).json({ message: "success", token });
      } else {
        // User found, verify password
        const userData = userDoc.data();
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (passwordMatch) {
          const token = jwt.sign({ username }, jwtSecretKey);
          res.status(200).json({ message: "success", token });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

app.post("/verify", (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];
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

app.post("/check-account", async (req, res) => {
    const { username } = req.body;
    try {
        const userDoc = await db.collection("users").doc(username).get();
        const userExists = userDoc.exists;
        res.status(200).json({ status: userExists ? "User exists" : "User does not exist", userExists });
    } catch (error) {
        console.error("Check account error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/update-password", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").doc(username).update({ password: hashedPassword });
        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ success: false, message: "Failed to update password" });
    }
});

app.listen(3080, () => {
  console.log("Server is running on port 3080");
});