import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import Order from './Order';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState("")

    useEffect(() => {
        // Fetch the user email and token from local storage
        const user = JSON.parse(localStorage.getItem("user"))

        // If the token/username does not exist, mark the user as logged out
        if (!user || !user.token) {
            setLoggedIn(false)
            return
        }

        // Verify the token with the server
        verifyToken(user.token);
    }, [])

    const verifyToken = (token) => {
        fetch("http://localhost:3080/verify", {
            method: "POST",
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token }) // Send token in the request body
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "logged in") {
                setLoggedIn(true);
                setUsername(data.username || "");
            } else {
                setLoggedIn(false);
                setUsername("");
            }
        })
        .catch(error => {
            console.error('Error verifying token:', error);
            setLoggedIn(false);
            setUsername("");
        });
    };

    const ProtectedRoute = ({ element }) => {
        return loggedIn ? element : <Navigate to="/login" />;
    };

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
                    <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setUsername={setUsername} />} /> 
                    <Route path="/reset-password" element={<ResetPassword setLoggedIn={setLoggedIn} setUsername={setUsername} />} /> 
                    <Route path="/order" element={<ProtectedRoute element={<Order username={username} />} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;