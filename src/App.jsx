import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import LogoutButton from "./components/LogoutButton";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <div className="p-4">
      <LogoutButton />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
