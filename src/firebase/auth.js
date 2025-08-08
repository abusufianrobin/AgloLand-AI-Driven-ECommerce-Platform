import { auth, db } from "./firebase"; // Import auth and db from firebase.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile, // Import updateProfile to set display name
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

// Function to create a user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Function to create/update user document in Firestore
// This is called after successful Firebase Auth registration
export const doCreateUser = async (user, fullName, phone, role) => {
  // Set the user's display name in Firebase Authentication profile
  await updateProfile(user, { displayName: fullName });

  // Store additional user data in Firestore
  await setDoc(doc(db, "users", user.uid), {
    fullName: fullName,
    email: user.email,
    phone: phone,
    role: role,
    createdAt: new Date(), // Timestamp for when the user was created
  });
};

// Function to sign in a user with email and password
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Function to sign in with Google (needs Firebase console setup for Google Auth Provider)
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // For Google sign-in, you might want to check if a user document already exists.
  // If not, create a basic one. You might need to prompt for role/phone later.
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      fullName: user.displayName || user.email,
      email: user.email,
      phone: null, // Google Auth usually doesn't provide phone
      role: "buyer", // Default role for Google sign-ups, can be updated later
      createdAt: new Date(),
    });
  }
  return user;
};

// Function to sign out the current user
export const doSignOut = () => {
  return auth.signOut();
};

// Function to send a password reset email
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Function to change the current user's password
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

// Function to send an email verification link
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`, // Redirect back to home after verification
  });
};
