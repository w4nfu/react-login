import React from "react"
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    document.title = "Home";
    const { loggedIn, username } = props
    const navigate = useNavigate();
    
    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }

    return (
        <div className="mainContainer">
            <div className={"titleContainer"}>
                <div>Password Manager</div>
            </div>
            <div>
                <h1>{loggedIn ? `Welcome ${username}!` : ""}</h1>
            </div>
            <div className={"buttonContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClick}
                    value={loggedIn ? "Log out" : "Log in"} />
            </div>
        </div>
    );
}

export default Home;