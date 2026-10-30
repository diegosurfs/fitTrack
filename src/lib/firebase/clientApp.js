
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBG7qRUf_XQwtDlp1L7mYC208PqaA2EBfA",
  authDomain: "fittrack-784b0.firebaseapp.com",
  projectId: "fittrack-784b0",
  storageBucket: "fittrack-784b0.firebasestorage.app",
  messagingSenderId: "208032063488",
  appId: "1:208032063488:web:87a4fdd54c58992c0c78e5"
};

const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
