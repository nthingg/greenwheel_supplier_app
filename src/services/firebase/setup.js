// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  ReCaptchaV3Provider,
} from "firebase/app-check";
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

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LeRzJ8pAAAAAChR4WTKscNAuhZlCq2FI95S4U5o"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
