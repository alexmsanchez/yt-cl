import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBYyiYRECBV-oXJz8Lt_3iDONODyJ-CQX4",
  authDomain: "yt-cl-67001.firebaseapp.com",
  projectId: "yt-cl-67001",
  appId: "1:86964810662:web:fb825972f3e9c44faa9567",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions();

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOut = () => {
  return auth.signOut();
};

export const onAuthStateChangedHelper = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
