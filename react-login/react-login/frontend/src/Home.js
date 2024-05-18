import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ loggedIn, username, setLoggedIn }) => {
    document.title = "Pizza Order";
    const navigate = useNavigate();

    const handleOrderClick = () => {
        navigate("/order");
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleLogout = async () => {
        try {
            // Call the logout endpoint to clear the session on the server
            const response = await fetch("http://localhost:3080/logout", {
                method: "POST",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                // Clear user authentication token from local storage
                localStorage.removeItem("user");
                // Update state to mark user as logged out
                setLoggedIn(false);
                // Redirect to the home page
                navigate("/");
            } else {
                throw new Error("Failed to logout");
            }
        } catch (error) {
            console.error("Logout error:", error);
            // Handle error (e.g., display an error message)
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Pizza Order</div>
            </div>
            <div>
                <h1>{loggedIn ? `Welcome ${username}! Ready to order?` : "Welcome to Pizza Order"}</h1>
            </div>
            <div className="buttonContainer">
                {loggedIn ? (
                    <>
                        <input
                            className="inputButton"
                            type="button"
                            onClick={handleOrderClick}
                            value="Order Pizza"
                        />
                        <br/>
                        <input
                            className="inputButton"
                            type="button"
                            onClick={handleLogout}
                            value="Log out"
                        />
                    </>
                ) : (
                    <input
                            className="inputButton"
                            type="button"
                            onClick={handleLoginClick}
                            value="Log in to Order"
                    />
                )}
            </div>
        </div>
    );
};

export default Home;