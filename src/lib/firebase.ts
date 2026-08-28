import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCt4vPxfOXdpZEnNcWoogTb38DpD73qtwY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "atideto-certificate.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "atideto-certificate",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "atideto-certificate.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "328863665401",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:328863665401:web:f84bfd3d7d7740e57ce628",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5QLYHTDFGC",
};

// Initialize Firebase safely
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn("Firebase fallback initialization:", e);
  app = !getApps().length ? initializeApp({ apiKey: "AIzaSyDummyKeyForLocalDev123456789", projectId: "atideto-dev" }) : getApp();
}

// Firebase Auth & Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

// Firebase Analytics (conditional)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
  if (supported) {
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Firebase Analytics disabled:", e);
    }
  }
}).catch(() => {});

export { app, auth, db, analytics };
