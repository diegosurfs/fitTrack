
import "server-only";

import { cookies } from "next/headers";
import {
  initializeServerApp,
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBG7qRUf_XQwtDlp1L7mYC208PqaA2EBfA",
  authDomain: "fittrack-784b0.firebaseapp.com",
  projectId: "fittrack-784b0",
  storageBucket: "fittrack-784b0.firebasestorage.app",
  messagingSenderId: "208032063488",
  appId: "1:208032063488:web:87a4fdd54c58992c0c78e5",
};

const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export async function getAuthenticatedAppForUser() {
  const sessionCookie = (await cookies()).get("__session")?.value;

  const firebaseServerApp = initializeServerApp(firebaseApp, {
    authIdToken: sessionCookie,
  });

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return {
    firebaseServerApp,
    currentUser: auth.currentUser,
  };
}
