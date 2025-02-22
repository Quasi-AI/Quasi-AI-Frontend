import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// 🔹 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH_3l6IEAldLkXyB0CXqYpHRwWDvqZjhU",
  authDomain: "park4me-b2127.firebaseapp.com",
  projectId: "park4me-b2127",
  storageBucket: "park4me-b2127.appspot.com",
  messagingSenderId: "372838267059",
  appId: "1:372838267059:web:20430ac4e8fe7f2f4cd8c6",
};

// ✅ Check if Firebase is already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔹 Firebase Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔹 Firebase Storage
const storage = getStorage(app);

// 🔹 Export Firebase services
export { auth, provider, signInWithPopup, storage, storageRef, uploadBytes, getDownloadURL };
