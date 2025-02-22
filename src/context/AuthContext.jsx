import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userInfo = result.user;

      setUser(userInfo);

      // Send user details to the backend
      await axios.post(
        "https://task-manager-backend-1-vyq6.onrender.com/users",
        {
          uid: userInfo.uid,
          email: userInfo.email,
          displayName: userInfo.displayName,
        }
      );
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Keep user logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
