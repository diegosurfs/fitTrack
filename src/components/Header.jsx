
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "@/src/lib/firebase/auth";

import { addFakeWorkoutsAndReviews } from "@/src/lib/firebase/firestore.js";function useUserSession(initialUser) {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    return onIdTokenChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
  }, []);

  return user;
}

export default function Header({ initialUser }) {
  const user = useUserSession(initialUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async (event) => {
    event.preventDefault();
    await signOut();
    setMenuOpen(false);
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert(error.message);
    }
  };

  const handleAddWorkouts = async (event) => {
    event.preventDefault();

    try {
      await addFakeWorkoutsAndReviews();
      alert("Sample workouts added successfully!");
      setMenuOpen(false);
    } catch (error) {
      console.error("Could not add sample workouts:", error);
      alert(error.message);
    }
  };

  return (
    <header>
      <Link href="/" className="logo">
        FITTRACK
      </Link>

      {user ? (
        <div className="profile">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              className="profileImage"
              src={user.photoURL || "/profile.svg"}
              alt={user.email || "User profile"}
            />
            {user.displayName || user.email || "My Account"}
          </button>

          {menuOpen && (
            <div className="menu">
              <ul>
                <li>{user.displayName || user.email}</li>
                <li>
                  <a href="#" onClick={handleAddWorkouts}>
                    Add sample workouts
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="profile">
          <a href="#" onClick={handleSignIn}>
            <img src="/profile.svg" alt="User profile" />
            Sign In with Google
          </a>
        </div>
      )}
    </header>
  );
}
