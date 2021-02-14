import React from "react";
import "./App.css";
import { auth } from "./firebase";
import Game from "./game/Game";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/About/About";

import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
    const [user] = useAuthState(auth);

    return (
        <Router>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Game}></Route>
                <Route path="/chat" exact component={ChatRoom}></Route>
                <Route path="/about" exact component={About}></Route>
                <Route path="/signin" exact component={SignIn}></Route>
                <Route path="/signout" exact component={SignOut}></Route>
            </Switch>
        </Router>
    );
}

export default App;
