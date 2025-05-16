// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDikq9FT-8eqsXlPUHrY5See6RrUOfqY1Y",
  authDomain: "affiliate-san-pham-khuyen-mai.firebaseapp.com",
  databaseURL: "https://affiliate-san-pham-khuyen-mai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "affiliate-san-pham-khuyen-mai",
  storageBucket: "affiliate-san-pham-khuyen-mai.firebasestorage.app",
  messagingSenderId: "1094673826787",
  appId: "1:1094673826787:web:bad330758f1d14e7a7d6d6",
  measurementId: "G-MMSB2W2J9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app) 

export  { db }