import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = (props) => {
    document.title = "Registration";
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

        if (username.length < 4 || username.length > 50 || typeof username !== "string") {
            setUsernameError("Please enter a valid username");
            return;
        }

        if (password === "") {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 8) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        // Register the user
        registerUser();
    };

    const registerUser = () => {
        fetch("http://localhost:3080/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                alert("Account registered successfully!");
                navigate("/login");
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data && data.message) {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Registration error:", error);
            alert("Failed to register. Please try again.");
        });
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Registration</div>
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
                    value={"Register"} />
            </div>
        </div>
    );
}

export default Register;