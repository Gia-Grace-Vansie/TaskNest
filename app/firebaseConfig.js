// app/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD52hbXD-4lbdKYzBpR65Mac25qLe5NOgg",
  authDomain: "tasknest-1780b.firebaseapp.com",
  projectId: "tasknest-1780b",
  storageBucket: "tasknest-1780b.appspot.com",
  messagingSenderId: "772927447522",
  appId: "1:772927447522:web:55a6456bfb564cc3fd99bb",
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
