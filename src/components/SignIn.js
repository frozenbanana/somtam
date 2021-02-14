import react from "react";

import firebase from "firebase/app";
import { auth } from "../firebase";

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => console.log("Signin result", result))
            .catch((error) => console.error("Sigin error", error));
    };

    return (
        <button className="sign-in" onClick={signInWithGoogle}>
            Sign in with Google
        </button>
    );
}

export default SignIn;
