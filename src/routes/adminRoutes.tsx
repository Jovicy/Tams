import { Route } from "react-router-dom";
import AdminRouteGuard from "../components/AdminRouteGuard";
import AdminLayout from "../layout/AdminLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminProducts from "../pages/admin/Products";
import AdminCategories from "../pages/admin/Categories";
import AdminPaymentPlans from "../pages/admin/PaymentPlans";
import AdminOrders from "../pages/admin/Orders";
import AdminRefunds from "../pages/admin/Refunds";
import AdminNotifications from "../pages/admin/Notifications";

export const adminRoutes = (
  <Route
    path="/admin"
    element={
      <AdminRouteGuard>
        <AdminLayout />
      </AdminRouteGuard>
    }>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="plans" element={<AdminPaymentPlans />} />
    <Route path="orders" element={<AdminOrders />} />
    {/* KYC reviews removed */}
    <Route path="refunds" element={<AdminRefunds />} />
    <Route path="notifications" element={<AdminNotifications />} />
  </Route>
);
