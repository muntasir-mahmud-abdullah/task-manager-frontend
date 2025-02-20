import React from "react";
import { auth, signOut } from "../firebaseConfig";

const Logout = ({ setUser }) => {
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;