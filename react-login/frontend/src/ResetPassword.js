import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
    document.title = "Reset Password";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const navigate = useNavigate();
    const handleResetPassword = () => {
        // Validate username, password, and confirm password
        if (username.trim() === "") {
            setUsernameError("Please enter your username");
            return;
        }
        if (password.trim() === "") {
            setPasswordError("Please enter a new password");
            return;
        }
        if (password.length < 8) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        // Call updatePassword function to update the password
        updatePassword();
    };

    const updatePassword = () => {
        fetch("http://localhost:3080/update-password", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Password updated successfully
                    // You can navigate to a success page or display a success message
                    console.log("Password updated successfully");
                    navigate("/")
                } else {
                    // Password update failed
                    // You can show an error message to the user
                    console.error("Failed to update password");
                    navigate("/")
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Reset Password</div>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{usernameError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    type="password"
                    value={password}
                    placeholder="Enter new password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{confirmPasswordError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={handleResetPassword}
                    value={"Reset"} />
            </div>
        </div>
    );
};

export default ForgotPassword;