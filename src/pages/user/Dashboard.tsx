import { Link, useNavigate } from "react-router-dom";
import { LuArrowRight, LuCircleAlert, LuMailWarning, LuShoppingBag } from "react-icons/lu";
import { refreshAuthUserProfile, useAuthStore } from "../../store/authStore";
import { useEffect, useState } from "react";
import { getUserDashboard } from "../../api/dashboard";
import type { RecentOrder } from "../../api/dashboard";
import { notifyError, notifyResponse } from "../../lib/notification";
import { requestEmailVerification } from "../../api/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuthStore();
  const isEmailVerified = session?.user.isEmailVerified ?? false;
  const hasPendingEmailVerification = Boolean(session?.user.emailVerificationOtpExpiresAt) && !isEmailVerified;
  const isKycVerified = session?.user.isKycVerified ?? false;
  const isSubmittedKyc = session?.user.isSubmittedKYC ?? false;
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalCommitted, setTotalCommitted] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await getUserDashboard();
        const data = res.data;
        if (!mounted || !data) return;

        setRecentOrders(data.recentOrders ?? []);
        setTotalOrders(data.totalOrders ?? 0);
        setPendingOrders(data.pendingOrders ?? 0);
        setTotalCommitted(data.totalCommitted ?? 0);
      } catch (err) {
        // ignore
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [session]);

  const handleVerifyEmailClick = async () => {
    if (hasPendingEmailVerification) {
      navigate("/verify-email");
      return;
    }

    setEmailVerificationLoading(true);

    try {
      const response = await requestEmailVerification();
      void (await refreshAuthUserProfile());
      notifyResponse(response);
      navigate("/verify-email");
    } catch (error) {
      notifyError(error, "Unable to start email verification.");
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">Welcome {session?.user.fullName}</h1>
          <p className="text-muted-text mt-1">Manage your gold portfolio</p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md border border-yellow-500/30 bg-yellow-500/20 text-yellow-400 text-sm font-medium">
          <LuCircleAlert className="h-4 w-4" />
          {!isKycVerified ? (isSubmittedKyc ? "KYC Under Review" : "KYC Not Submitted") : !isEmailVerified ? "Email Not Verified" : "Account Active"}
        </div>
      </div>

      {/* KYC ALERT */}
      {!isKycVerified && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start sm:items-center gap-3">
            <LuCircleAlert className="h-5 w-5 text-yellow-400 mt-1 sm:mt-0" />

            <div>
              <p className="font-medium text-foreground">{isSubmittedKyc ? "KYC verification in progress" : "Complete your KYC verification"}</p>
              <p className="text-sm text-muted-text">{isSubmittedKyc ? "Your submission is being reviewed. Please wait for approval." : "Verify your identity to unlock all features"}</p>
            </div>
          </div>

          {!isSubmittedKyc && (
            <Link
              to="/kyc"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md border border-yellow-500/30 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition">
              Verify Now
              <LuArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {!isEmailVerified && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start sm:items-center gap-3">
            <LuMailWarning className="h-5 w-5 text-yellow-400 mt-1 sm:mt-0" />

            <div>
              <p className="font-medium text-foreground">Verify your email address</p>
              <p className="text-sm text-muted-text">Confirm your inbox to keep your account secure and receive updates</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerifyEmailClick}
            disabled={emailVerificationLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md border border-yellow-500/30 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {emailVerificationLoading ? "Sending code..." : "Verify Now"}
            <LuArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition">
          <LuShoppingBag className="h-5 w-5 text-primary mb-3" />
          <p className="text-2xl md:text-3xl font-bold text-foreground">{totalOrders}</p>
          <p className="text-sm text-muted-text mt-1">Total Orders</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition">
          <LuCircleAlert className="h-5 w-5 text-primary mb-3" />
          <p className="text-2xl md:text-3xl font-bold text-foreground">{pendingOrders}</p>
          <p className="text-sm text-muted-text mt-1">Pending Orders</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition">
          <LuMailWarning className="h-5 w-5 text-primary mb-3" />
          <p className="text-2xl md:text-3xl font-bold text-foreground">{totalCommitted}</p>
          <p className="text-sm text-muted-text mt-1">Total Committed</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition">
          <LuArrowRight className="h-5 w-5 text-primary mb-3" />
          <p className="text-2xl md:text-3xl font-bold text-foreground">{recentOrders.length}</p>
          <p className="text-sm text-muted-text mt-1">Recent Orders</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT ORDERS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-playfair text-lg md:text-xl font-semibold text-foreground">Recent Orders</h2>

            <a href="/shop" className="text-sm text-primary flex items-center gap-1 hover:underline">
              Browse
              <LuArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <LuShoppingBag className="h-8 w-8 text-muted-text mx-auto mb-3" />
                <p className="text-muted-text">No orders yet</p>
                <a href="/shop" className="inline-flex items-center justify-center mt-4 px-4 py-2 text-xs font-medium rounded-md bg-primary text-black hover:opacity-90 transition">
                  Shop Now
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{o.product?.name ?? `Product ${o.productId}`}</div>
                      <div className="text-xs text-muted-text">{new Date(o.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">{o.totalPrice}</div>
                      <div className="text-xs text-muted-text">{o.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
