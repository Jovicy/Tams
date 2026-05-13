import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import UserRouteGuard from "../components/UserRouteGuard";

import HomePage from "../pages/HomePage";
import ProductDetails from "../pages/user/ProductDetails";
import ShopPage from "../pages/user/ShopPage";
import PlanPage from "../pages/user/PlanPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import FaqPage from "../pages/FaqPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import Dashboard from "../pages/user/Dashboard";
import KycPage from "../pages/user/KycPage";
import ProfilePage from "../pages/user/Profile";
import OrderTrackingPage from "../pages/user/OrderTracking";
import CheckoutPage from "../pages/user/Checkout";

export const customerRoutes = (
  <>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Route>

    <Route
      element={
        <UserRouteGuard>
          <MainLayout />
        </UserRouteGuard>
      }>
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/plans" element={<PlanPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/kyc" element={<KycPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/orders/my" element={<OrderTrackingPage />} />
      <Route path="/checkout/:id" element={<CheckoutPage />} />
    </Route>
  </>
);
