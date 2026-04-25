import { Navigate } from "react-router-dom";

import { AuthContext } from "./AuthProvider";
import { useContext, type ReactNode } from "react";
export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useContext(AuthContext)!;
  if (loading) {
    return <div>Checking session...</div>;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (user.role === "user") {
    return <Navigate to="/not-authorized" replace />;
  }
  return children;
}
