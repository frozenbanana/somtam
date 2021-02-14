import React, { useEffect, useRef, useState } from "react";
import "./ChatRoom.css";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "../ChatMessage";
import Sidebar from "../Sidebar/Sidebar";

import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const auth = firebase.auth();
const firestore = firebase.firestore();

function ChatRoom() {
    const messagesRef = firestore.collection("messages");
    const query = messagesRef.orderBy("createdAt").limitToLast(25);

    const [messages] = useCollectionData(query, { idField: "id" });
    const [formValue, setFormValue] = useState(""); // form to send message
    const dummy = useRef(); // ??

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // On submit message (user pressing enter)
    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
        });

        setFormValue("");
    };

    return (
        <div className="chat__container">
            <Sidebar />
            <main>
                {messages &&
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                <span ref={dummy}></span>
            </main>

            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="say something nice"
                />
                <button
                    className="message__submit"
                    type="submit"
                    disabled={!formValue}
                >
                    🕊️
                </button>
            </form>
        </div>
    );
}

export default ChatRoom;
