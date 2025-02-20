import React from "react";
import { auth, provider, signInWithPopup } from "../firebaseConfig";

const Login = ({ setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  );
};

export default Login;
