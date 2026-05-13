import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AdminRouteGuard = ({ children }: PropsWithChildren) => {
  const { session } = useAuthStore();
  const role = session?.user.role;
  const isAdmin = role === "admin" || role === "super_admin";

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRouteGuard;
