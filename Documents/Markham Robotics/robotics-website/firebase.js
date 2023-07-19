// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAe8p8gZ9D9loN-PBFHISiiAeej5-fDkAE",
    authDomain: "robotics-dfd5e.firebaseapp.com",
    projectId: "robotics-dfd5e",
    storageBucket: "robotics-dfd5e.appspot.com",
    messagingSenderId: "663525102840",
    appId: "1:663525102840:web:3d7c1bff5e33856ebfd70d",
    measurementId: "G-V1SFB6GZ5H"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);