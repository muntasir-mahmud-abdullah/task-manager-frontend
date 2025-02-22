import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, loginWithGoogle } = useAuth();

  if (user) {
    return <Navigate to="/" />; // Redirect to dashboard if logged in
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Organize Your Work & Life
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Task management made simple. Focus on what matters most.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all hover:shadow-2xl">
        <div className="text-center space-y-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Get Started
            </h2>
            <p className="text-gray-500">Sign in to continue</p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {/* Google logo paths from previous example */}
            </svg>
            Continue with Google
          </button>

          {/* Feature List */}
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-600">✓</div>
              <div className="text-sm text-gray-600">Simple</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-600">⚡</div>
              <div className="text-sm text-gray-600">Fast</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-600">🔒</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Made for thousands of productive people worldwide</p>
        <div className="mt-4 flex justify-center space-x-6">
          <span>✓ Free Forever</span>
          <span>•</span>
          <span>🔐 Private by Default</span>
        </div>
      </div>
    </div>
  );
};

export default Login;