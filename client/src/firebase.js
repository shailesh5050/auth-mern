// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-b88c3.firebaseapp.com",
  projectId: "mern-auth-b88c3",
  storageBucket: "mern-auth-b88c3.appspot.com",
  messagingSenderId: "102801948173",
  appId: "1:102801948173:web:f7ccbec55f1fcdda935f44",
};

// Initialize Firebase
export const authFirebase = initializeApp(firebaseConfig);
