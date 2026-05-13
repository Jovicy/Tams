import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface AuthRedirectProps {
  to?: string;
  adminTo?: string;
}

const AuthRedirect = ({ children, to = "/dashboard", adminTo = "/admin" }: PropsWithChildren<AuthRedirectProps>) => {
  const { session, isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    const role = session?.user.role;
    const redirectTo = role === "admin" || role === "super_admin" ? adminTo : to;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default AuthRedirect;
