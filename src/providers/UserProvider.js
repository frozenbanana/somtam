import React, { Component, createContext } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const auth = firebase.auth();

export const UserContext = createContext({ user: null });

class UserProvider extends UserContext {
    state = {
        user: null,
    };

    componentDidMount = () => {
        auth.onAuthStateChanged((userAuth) => {
            this.setState({ user: userAuth });
        });
    };

    render() {
        return (
            <UserContext.Provider value={this.state.user}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserProvider;
