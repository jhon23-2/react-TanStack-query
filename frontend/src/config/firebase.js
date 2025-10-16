import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCw3epDSx0syVswDRZUCHAn6klMMKb1vF0",
  authDomain: "authentication-3da37.firebaseapp.com",
  projectId: "authentication-3da37",
  storageBucket: "authentication-3da37.firebasestorage.app",
  messagingSenderId: "608268310049",
  appId: "1:608268310049:web:0eee7e496218eccc547560"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();