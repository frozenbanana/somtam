import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "somtam-d219e.firebaseapp.com",
    projectId: "somtam-d219e",
    storageBucket: "somtam-d219e.appspot.com",
    messagingSenderId: "470940416753",
    appId: process.env.REACT_APP_APP_ID,
    measurementId: "G-4WW8X8RXXY",
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();
