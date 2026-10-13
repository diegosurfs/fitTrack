
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  onIdTokenChanged as firebaseOnIdTokenChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { auth } from "./clientApp";

export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback);
}

export function onIdTokenChanged(callback) {
  return firebaseOnIdTokenChanged(auth, callback);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOut() {
  return firebaseSignOut(auth);
}