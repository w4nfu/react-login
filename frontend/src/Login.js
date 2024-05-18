import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = (props) => {
    document.title = "Login";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    const onButtonClick = () => {
        setUsernameError("");
        setPasswordError("");

        if (username === "") {
            setUsernameError("Please enter your username");
            return;
        }

        if (username.length < 2) {
            setUsernameError("Please enter a valid username");
            return;
        }

        if (password === "") {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 5) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        logIn();
    };

    const logIn = () => {
        fetch("http://localhost:3080/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // This is crucial for setting cookies
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Login failed');
            }
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem("user", JSON.stringify({ username, token: data.token }));
                props.setLoggedIn(true);
                props.setUsername(username);
                navigate("/");
            } else {
                window.alert("Wrong username or password");
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            window.alert("Failed to log in. Please try again.");
        });
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Login</div>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={username}
                    placeholder="Enter your username here"
                    onChange={ev => setUsername(ev.target.value)}
                    className={"inputBox"} />
                <label className="errorLabel">{usernameError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    type="password"
                    value={password}
                    placeholder="Enter your password here"
                    onChange={ev => setPassword(ev.target.value)}
                    className={"inputBox"} />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClick}
                    value={"Log in"} />
            </div>
            <div className={"inputContainer"}>
                <p>Don't have an account? <Link to="/register" className={"registerLink"}>Register</Link></p>
            </div>
            <div className={"inputContainer"}>
                <Link to="/reset-password" className={"forgotPasswordLink"}>Forgot Password?</Link>
            </div>
        </div>
    );
}

export default Login;