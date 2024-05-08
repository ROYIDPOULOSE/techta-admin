// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsFEgHORBOtDSBea0Tg46UXdZXuWgGd2U",
  authDomain: "techta-254f9.firebaseapp.com",
  projectId: "techta-254f9",
  storageBucket: "techta-254f9.appspot.com",
  messagingSenderId: "794463928125",
  appId: "1:794463928125:web:e0dd5b59f6f93da20c8f54",
  measurementId: "G-7KZLKV7XK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Get a reference to the Firestore database
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Check if the current environment supports Firebase Analytics
isSupported()
  .then((supported) => {
    if (supported) {
      // Initialize Firebase Analytics only if it's supported (browser environment)
      const analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized");
    } else {
      console.log("Firebase Analytics not supported in this environment");
    }
  })
  .catch((error) => {
    console.error("Error checking Firebase Analytics support:", error);
  });

export { app, db };