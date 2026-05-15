import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { signOut, useAuthStore } from "../store/authStore";
import Preloader from "./Preloader";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const { isAuthenticated, loading } = useAuthStore();

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <span className="font-playfair text-2xl font-extrabold text-primary">Tamara Jewelries</span>
          </Link>
          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <Link to="/shop" className="text-sm font-medium text-muted-text transition hover:text-primary">
                Shop
              </Link>
            </li>

            <li>
              <Link to="/plans" className="text-sm font-medium text-muted-text transition hover:text-primary">
                Payment Plans
              </Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link to="/orders/my" className="text-sm font-medium text-muted-text transition hover:text-primary">
                  My Orders
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {!isDashboard && (
                <Link to="/dashboard">
                  <button className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-black transition hover:opacity-90">Dashboard</button>
                </Link>
              )}

              <button onClick={handleLogout} className="rounded-md border border-border px-4 py-2 text-sm text-muted-text transition hover:border-red-400 hover:text-red-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="rounded-md border border-border px-4 py-2 text-sm text-muted-text transition hover:border-primary hover:text-primary">Login</button>
              </Link>

              <Link to="/signup">
                <button className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-black transition hover:opacity-90">Create Account</button>
              </Link>
            </>
          )}
        </div>

        <button className="text-2xl text-foreground md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX size={30} /> : <HiMenu size={30} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <div className="container flex flex-col gap-6 py-6">
            <Link to="/shop" onClick={() => setIsOpen(false)}>
              Shop
            </Link>

            <Link to="/plans" onClick={() => setIsOpen(false)}>
              Payment Plans
            </Link>

            {isAuthenticated && (
              <Link to="/orders/my" onClick={() => setIsOpen(false)}>
                My Orders
              </Link>
            )}

            <div className="border-t border-border/40" />

            {isAuthenticated ? (
              <>
                {!isDashboard && (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <button className="w-full rounded-md bg-primary px-4 py-2 font-medium text-black">Dashboard</button>
                  </Link>
                )}

                <button onClick={handleLogout} className="w-full rounded-md border border-border px-4 py-2 text-red-400">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>

                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm p-4">
            <Preloader title="Loading" message="Please wait..." />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
