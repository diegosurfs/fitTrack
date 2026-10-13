"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqK6J8gXwkMOLvLfxEyy1N8jdi5jETxQo",
  authDomain: "week7-assignment8-restaurants.firebaseapp.com",
  projectId: "week7-assignment8-restaurants",
  storageBucket: "week7-assignment8-restaurants.firebasestorage.app",
  messagingSenderId: "779525023996",
  appId: "1:779525023996:web:45ec37ba903b9ba29d4f79",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);