// src/contexts/authContext/index.jsx

import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase"; // Make sure firebase.js correctly exports auth and db
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        const userDocSnap = await getDoc(userDocRef);

        let userData = {};
        if (userDocSnap.exists()) {
          userData = userDocSnap.data();
        } else {
          console.warn("User document not found in Firestore for UID:", user.uid);
          // If no user document, you might want to create a default one here,
          // especially for Google sign-ins that don't go through your register form.
          // For now, we'll proceed with basic user data.
        }

        setCurrentUser({
          ...user,
          fullName: userData.fullName || user.displayName || user.email,
          role: userData.role || null,
        });

        const isEmail = user.providerData.some(
          (provider) => provider.providerId === "password"
        );
        setIsEmailUser(isEmail);

        setUserLoggedIn(true);
      } catch (firestoreError) {
        console.error("Error fetching user data from Firestore:", firestoreError);
        // Fallback: If Firestore fetch fails, still consider user logged in based on Firebase Auth
        setCurrentUser(user);
        setUserLoggedIn(true);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false); // Authentication check is complete
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    currentUser,
    setCurrentUser,
    loading // Expose loading state
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when loading is false */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
          <p className="text-xl text-green-700">Loading user session...</p>
          {/* You could add a more elaborate spinner here */}
        </div>
      )}
    </AuthContext.Provider>
  );
}