import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUgqx0Fg7t4oD0BvGDrf3Cz5li21gmw0o",
  authDomain: "task-manager-a8e74.firebaseapp.com",
  projectId: "task-manager-a8e74",
  storageBucket: "task-manager-a8e74.firebasestorage.app",
  messagingSenderId: "346515891275",
  appId: "1:346515891275:web:8d550e584ec97eb3d859ce",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
