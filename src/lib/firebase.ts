import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA9lhhLwyp6f3ReDXaLPauIuvpuP3RyUQU",
  authDomain: "nitha-8f9f4.firebaseapp.com",
  databaseURL: "https://nitha-8f9f4-default-rtdb.firebaseio.com",
  projectId: "nitha-8f9f4",
  storageBucket: "nitha-8f9f4.firebasestorage.app",
  messagingSenderId: "332719594661",
  appId: "1:332719594661:web:b28494271524377a38014c",
  measurementId: "G-QR4GP78RY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (it might not be supported in some environments like SSR)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics };
