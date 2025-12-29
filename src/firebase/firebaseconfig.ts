// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD496Jp5-egwkHlbXCm8JDISkC-jG3iPKg",
  authDomain: "learnmitmir-6f6e2.firebaseapp.com",
  projectId: "learnmitmir-6f6e2",
  storageBucket: "learnmitmir-6f6e2.firebasestorage.app",
  messagingSenderId: "944879044780",
  appId: "1:944879044780:web:6c796ca58ef5199af67709"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
