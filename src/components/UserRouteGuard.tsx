import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const UserRouteGuard = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserRouteGuard;
