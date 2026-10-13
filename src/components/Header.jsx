
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "@/src/lib/firebase/auth";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore";

function useUserSession(initialUser) {
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

  const handleAddRestaurants = async (event) => {
    event.preventDefault();
    try {
      await addFakeRestaurantsAndReviews();
      alert("Sample restaurants added!");
      setMenuOpen(false);
    } catch (error) {
      console.error("Could not add sample restaurants:", error);
      alert(error.message);
    }
  };

  return (
    <header>
      <Link href="/" className="logo">
        <img src="/friendlyeats.svg" alt="Friendly Eats" />
        Friendly Eats
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
                  <a href="#" onClick={handleAddRestaurants}>
                    Add sample restaurants
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