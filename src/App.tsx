import { useEffect } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { adminRoutes } from "./routes/adminRoutes";
import { authRoutes } from "./routes/authRoutes";
import { customerRoutes } from "./routes/customerRoutes";
import { refreshAuthUserProfile } from "./store/authStore";

function App() {
  useEffect(() => {
    void refreshAuthUserProfile();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#111111",
            color: "#f5f5f5",
            border: "1px solid rgba(212, 175, 55, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#d4af37",
              secondary: "#111111",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#111111",
            },
          },
        }}
      />
      <Routes>
        {customerRoutes}
        {authRoutes}
        {adminRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
