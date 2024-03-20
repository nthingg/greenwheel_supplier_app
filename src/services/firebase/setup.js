// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtSRzR5UHY_ko3SoY9znYWxdkJGBboa6Q",
  authDomain: "phuottravel-aa116.firebaseapp.com",
  projectId: "phuottravel-aa116",
  storageBucket: "phuottravel-aa116.appspot.com",
  messagingSenderId: "637018147234",
  appId: "1:637018147234:web:821a02d1b723f236218afb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
