import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

const firebaseConfig = {
  apiKey: // REPLACE WITH YOUR ACTUAL API KEY
  authDomain: // REPLACE WITH YOUR ACTUAL AUTH DOMAIN
  projectId: // REPLACE WITH YOUR ACTUAL PROJECT ID
  storageBucket:  // REPLACE WITH YOUR ACTUAL STORAGE BUCKET
  messagingSenderId:  // REPLACE WITH YOUR ACTUAL MESSAGING SENDER ID
  appId:  // REPLACE WITH YOUR ACTUAL APP ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
