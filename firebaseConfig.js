import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyAovJDNabbADQazNI03f5eZN4Dlg0or3EE",
    authDomain: "my-project-9c1c2.firebaseapp.com",
    projectId: "my-project-9c1c2",
    storageBucket: "my-project-9c1c2.appspot.com",
    messagingSenderId: "191983278532",
    appId: "1:191983278532:web:acff5907a1fc8f7c33ac91",
    measurementId: "G-2K6F6JTR6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);