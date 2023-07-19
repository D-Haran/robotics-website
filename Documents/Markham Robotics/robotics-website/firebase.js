// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAe8p8gZ9D9loN-PBFHISiiAeej5-fDkAE",
  authDomain: "robotics-dfd5e.firebaseapp.com",
  projectId: "robotics-dfd5e",
  storageBucket: "robotics-dfd5e.appspot.com",
  messagingSenderId: "663525102840",
  appId: "1:663525102840:web:a839c1a933962696bfd70d",
  measurementId: "G-TSDZ54RNG3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);