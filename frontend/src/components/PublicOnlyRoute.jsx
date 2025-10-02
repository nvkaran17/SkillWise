import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicOnlyRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) return <div className="container mt-5">Loading…</div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}
