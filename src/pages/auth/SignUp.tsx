import { useState, type FormEvent } from "react";
import { LuShieldCheck, LuSparkles, LuClock3, LuCircleCheckBig, LuLoaderCircle } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { signUp, useAuthStore } from "../../store/authStore";
import { notifyError, notifyResponse } from "../../lib/notification";

const SignUp = () => {
  const navigate = useNavigate();
  const { loading } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await signUp({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      notifyResponse(response);
      navigate("/dashboard");
    } catch (error) {
      notifyError(error, "Unable to create account.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-4xl border border-border bg-card p-8 md:p-10 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle at 20% 10%, rgba(212,175,55,0.12), transparent 30%), radial-gradient(circle at 90% 30%, rgba(212,175,55,0.08), transparent 25%)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="font-playfair text-2xl font-extrabold text-primary">Tamara Jewelries</span>
              </Link>

              <div className="max-w-xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Customer access</p>
                <h2 className="font-playfair text-4xl font-bold leading-tight text-foreground md:text-5xl">Create your account and start your jewelry journey.</h2>

                <p className="max-w-lg text-sm leading-6 text-muted-text md:text-base">
                  This flow is for customers only. Admin accounts use a separate invite-based path so the store stays secure and organized.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [LuSparkles, "Premium pieces", "Shop rings, necklaces, bracelets, and earrings."],
                  [LuClock3, "WhatsApp checkout", "Finish payments through a guided WhatsApp flow."],
                  [LuCircleCheckBig, "Verified orders", "Manual confirmation keeps every transaction tracked."],
                ].map(([Icon, title, text]) => (
                  <div key={title as string} className="rounded-2xl border border-border/80 bg-background/60 p-4 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 font-medium text-foreground">{title as string}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-text">{text as string}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuShieldCheck className="h-4 w-4 text-primary" />
              <span>Your data is safe with us</span>
            </div>
          </div>
        </section>

        <section className="rounded-4xl border border-border bg-card p-8 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] md:p-10">
          <div className="mb-8 space-y-2">
            <h2 className="font-playfair text-3xl font-bold text-foreground">Create customer account</h2>

            <p className="text-sm text-muted-text">Register once, then manage orders, KYC, refunds, and payment status from your dashboard.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>

              <input
                type="text"
                placeholder="Adaeze Okonkwo"
                value={formData.fullName}
                onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>

              <input
                type="tel"
                placeholder="08012345678"
                value={formData.phone}
                onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>

              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-12
                flex items-center justify-center gap-2
                rounded-lg
                bg-primary text-black font-semibold text-sm
                transition-all duration-200
                hover:bg-primary/90 hover:shadow-md
                active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-60
              ">
              {loading ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : null}
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-muted-text">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default SignUp;
