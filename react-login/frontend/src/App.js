import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
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

        // If the token exists, verify it with the auth server to see if it is valid
        fetch("http://localhost:3080/verify", {
            method: "POST",
            headers: {
                'jwt-token': user.token
            }
        })
            .then(r => r.json())
            .then(r => {
                setLoggedIn('success' === r.message)
                setUsername(user.username || "")
            })
    }, [])

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
                    <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setUsername={setUsername} />} /> 
                    <Route path="/reset-password" element={<ResetPassword setLoggedIn={setLoggedIn} setUsername={setUsername} />} /> 
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
