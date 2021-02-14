import React from "react";

import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const auth = firebase.auth();

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

    return (
        <>
            <div className={`message ${messageClass}`}>
                <img src={photoURL} />
                <p className="message__text">{text}</p>
            </div>
        </>
    );
}

export default ChatMessage;
