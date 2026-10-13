// Keep this module restricted to server-side code.
import "server-only";

// Import Next.js cookie handling.
import { cookies } from "next/headers";

// Import Firebase server and client initialization functions.
import { initializeServerApp, initializeApp } from "firebase/app";

// Import Firebase Authentication.
import { getAuth } from "firebase/auth";

// Return the authenticated Firebase app for server rendering.
export async function getAuthenticatedAppForUser() {
  // Read the session cookie.
  const sessionCookie = (await cookies()).get("__session")?.value;

  // Initialize Firebase with the web app configuration.
  const firebaseApp = initializeApp({
    apiKey: "AIzaSyBqK6J8gXwkMOLvLfxEyy1N8jdj5ETxQo",
    authDomain: "week7-assignment8-restaurants.firebaseapp.com",
    projectId: "week7-assignment8-restaurants",
    storageBucket: "week7-assignment8-restaurants.firebasestorage.app",
    messagingSenderId: "779525023996",
    appId: "1:779525023996:web:45ec37ba903b9ba29d4f79",
  });

  // Initialize the server-side Firebase app.
  const firebaseServerApp = initializeServerApp(firebaseApp, {
    authIdToken: sessionCookie,
  });

  // Wait for authentication state to initialize.
  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  // Return the Firebase app and current user.
  return { firebaseServerApp, currentUser: auth.currentUser };
}