// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Get a reference to the Firestore database
let firebaseApp;
if (!getApps().length){
  firebaseApp = initializeApp(firebaseConfig)
} else {
  firebaseApp =getApp()
  deleteApp(firebaseApp)
  firebaseApp = (firebaseApp)
}

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(firebaseApp);


// Check if the current environment supports Firebase Analytics
// isSupported()
//   .then((supported) => {
//     if (supported) {
//       // Initialize Firebase Analytics only if it's supported (browser environment)
//       const analytics = getAnalytics(app);
//       console.log("Firebase Analytics initialized");
//     } else {
//       console.log("Firebase Analytics not supported in this environment");
//     }
//   })
//   .catch((error) => {
//     console.error("Error checking Firebase Analytics support:", error);
//   });

// export { app, db };
export { db, auth };