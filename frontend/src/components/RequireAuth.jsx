// src/components/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <div className="container mt-5">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  return children;
}
