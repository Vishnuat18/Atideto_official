import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Sensitive keys are loaded from environment variables with production defaults as fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA9lhhLwyp6f3ReDXaLPauIuvpuP3RyUQU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nitha-8f9f4.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://nitha-8f9f4-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nitha-8f9f4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nitha-8f9f4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "332719594661",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:332719594661:web:b28494271524377a38014c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QR4GP78RY3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
const auth = getAuth(app);

// Firebase Firestore
const db = getFirestore(app);

// Firebase Analytics (conditional — not available in all environments)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, auth, db, analytics };
