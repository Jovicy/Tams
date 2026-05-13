import { useState, type FormEvent } from "react";
import { LuBadgeCheck, LuLoaderCircle, LuUsers } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifyResponse } from "../../lib/notification";
import { signInAdmin, useAuthStore } from "../../store/authStore";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await signInAdmin({
        email: formData.email.trim(),
        password: formData.password,
      });

      notifyResponse(response);
      navigate("/admin", { replace: true });
    } catch (error) {
      notifyError(error, "Unable to sign in as admin.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-4xl border border-border bg-card p-8 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] md:p-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="mb-8 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Admin access</p>
              <h2 className="font-playfair text-4xl font-bold text-foreground">Secure staff sign in</h2>
              <p className="text-sm text-muted-text">This panel is for inventory, orders, KYC review, refunds, and customer management.</p>
            </div>

            <div className="space-y-5">
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                placeholder="admin@example.com"
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                placeholder="Password"
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-primary text-black font-semibold text-sm flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : null}
                <span>{loading ? "Signing In..." : "Enter admin panel"}</span>
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              User access?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign in as user
              </Link>
            </p>
          </form>
        </section>

        <section className="relative overflow-hidden rounded-4xl border border-border bg-card p-8 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{ background: "radial-gradient(circle at top right, rgba(212,175,55,0.12), transparent 30%), radial-gradient(circle at bottom left, rgba(212,175,55,0.08), transparent 28%)" }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div className="space-y-5">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="font-playfair text-2xl font-extrabold text-primary">Tamara Jewelries</span>
              </Link>

              <div className="max-w-xl space-y-4">
                <h3 className="font-playfair text-3xl font-bold text-foreground md:text-4xl">Keep the admin workflow separate from customer sign up.</h3>
                <p className="text-sm leading-6 text-muted-text md:text-base">Admin access is invite-only so approvals, product edits, and payment confirmations stay controlled.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  [LuUsers, "Team control", "Manage staff roles and customer support."],
                  [LuBadgeCheck, "Manual approval", "Review orders, KYC, and refunds in one place."],
                ].map(([Icon, title, text]) => (
                  <div key={title as string} className="rounded-2xl border border-border/80 bg-background/60 p-4 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-primary" />
                    <h4 className="mt-3 font-medium text-foreground">{title as string}</h4>
                    <p className="mt-1 text-xs leading-5 text-muted-text">{text as string}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Separate login path from customer accounts</p>
          </div>
        </section>
      </div>
    </div>
  );
}
