import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

const firebaseConfig = {
  apiKey: "AIzaSyAO71vENxSX9Uhe2wbdPLRj2VCneMXAfD8", // REPLACE WITH YOUR ACTUAL API KEY
  authDomain: "reactfirebase-b600d.firebaseapp.com", // REPLACE WITH YOUR ACTUAL AUTH DOMAIN
  projectId: "reactfirebase-b600d", // REPLACE WITH YOUR ACTUAL PROJECT ID
  storageBucket: "reactfirebase-b600d.firebasestorage.app", // REPLACE WITH YOUR ACTUAL STORAGE BUCKET
  messagingSenderId: "1082642949965", // REPLACE WITH YOUR ACTUAL MESSAGING SENDER ID
  appId: "1:1082642949965:web:10cab636ac969ff8017904" // REPLACE WITH YOUR ACTUAL APP ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
