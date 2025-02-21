import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { user, logout } = useAuth();

  return (
    user && (
      <div className="flex items-center gap-4">
        <p className="text-lg">{user.displayName}</p>
        <button className="btn btn-error" onClick={logout}>
          Logout
        </button>
      </div>
    )
  );
};

export default LogoutButton;
