import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import ShopPage from "./pages/ShopPage";
import PlanPage from "./pages/PlanPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import TermsPage from "./pages/TermsPage";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pages WITH Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/plans" element={<PlanPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refunds" element={<RefundPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Pages WITHOUT Navbar/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
