// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-rvx3mtTy0gY1LuwLk8_OIKe7L37hKfw",
  authDomain: "job-alert-automation-25a30.firebaseapp.com",
  projectId: "job-alert-automation-25a30",
  storageBucket: "job-alert-automation-25a30.firebasestorage.app",
  messagingSenderId: "71539456641",
  appId: "1:71539456641:web:3ff984191b3a3b052d6b80",
  measurementId: "G-WVBNLL8LG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore functions
export { db, collection, addDoc };