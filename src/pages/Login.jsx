import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, loginWithGoogle } = useAuth();

  // If the user is already logged in, redirect to the dashboard.
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button className="btn btn-primary" onClick={loginWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
