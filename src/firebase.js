// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBceTwVq1xLtWeWqeW7SMVGxIlLbTLWwNU",
  authDomain: "fs-configurator-881f2.firebaseapp.com",
  projectId: "fs-configurator-881f2",
  storageBucket: "fs-configurator-881f2.firebasestorage.app",
  messagingSenderId: "446034165564",
  appId: "1:446034165564:web:42b71ec3547f30c3112839",
  measurementId: "G-PW6JBDFESL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth and Firestore for use in components
export const auth = getAuth(app);
export const db = getFirestore(app);
