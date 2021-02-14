import React from "react";
import "./Navbar.css";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import SignOut from "../SignOut";
import SignIn from "../SignIn";

function Navbar() {
    return (
        <header className="navbar">
            <h1 className="navbar__logo">Somtam</h1>
            <ul className="navbar__links">
                <Link to="/chat">
                    <li>Chat</li>
                </Link>
                <Link to="/about">
                    <li>About</li>
                </Link>

                {auth.currentUser ? <SignOut /> : <SignIn />}
            </ul>
        </header>
    );
}

export default Navbar;
