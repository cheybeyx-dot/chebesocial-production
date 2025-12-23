// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3yEwHP_iBjnlbNKKKx75Svu8H0PyiEeE",
  authDomain: "chebesocial-master.firebaseapp.com",
  projectId: "chebesocial-master",
  storageBucket: "chebesocial-master.firebasestorage.app",
  messagingSenderId: "791594233150",
  appId: "1:791594233150:web:b913303a30dd142965506f",
  measurementId: "G-CJFJTW9ZCS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
