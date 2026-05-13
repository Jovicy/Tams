import { Route } from "react-router-dom";

import AuthRedirect from "../components/AuthRedirect";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import AdminLogin from "../pages/auth/AdminLogin";

export const authRoutes = (
  <>
    <Route
      path="/login"
      element={
        <AuthRedirect>
          <Login />
        </AuthRedirect>
      }
    />
    <Route
      path="/signup"
      element={
        <AuthRedirect>
          <Signup />
        </AuthRedirect>
      }
    />
    <Route
      path="/forgot-password"
      element={
        <AuthRedirect>
          <ForgotPassword />
        </AuthRedirect>
      }
    />
    <Route path="/verify-email" element={<VerifyEmail />} />
    <Route
      path="/admin/login"
      element={
        <AuthRedirect to="/dashboard" adminTo="/admin">
          <AdminLogin />
        </AuthRedirect>
      }
    />
  </>
);
