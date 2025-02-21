import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Logout from "./components/Logout";

const App = () => {
  const [user, setUser] = useState(null);
  console.log(user)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <img src={user.photo} alt="Profile" width="50" />
          <Logout setUser={setUser} />
        </div>
      ) : (
        <Login setUser={setUser} />
      )}
    </div>
  );
};

export default App;
