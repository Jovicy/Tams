import { useState, type FormEvent } from "react";
import { LuShieldCheck, LuLoaderCircle } from "react-icons/lu";
import PasswordInput from "../../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { signIn, useAuthStore } from "../../store/authStore";
import { notifyError, notifyResponse } from "../../lib/notification";

const Login = () => {
  const navigate = useNavigate();
  const { loading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await signIn({
        email: formData.email.trim(),
        password: formData.password,
      });

      notifyResponse(response);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      notifyError(error, "Unable to sign in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-playfair text-2xl font-extrabold text-primary">Tamara Jewelries</span>
          </Link>

          <h2 className="mt-6 text-3xl font-bold text-foreground font-playfair">Welcome Back</h2>

          <p className="mt-2 text-sm text-muted-text">Sign in to your account</p>
        </div>

        {/* CARD */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
              <label className="text-sm font-medium text-foreground">Password</label>

              <PasswordInput
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                placeholder="••••••••"
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* FORGOT PASSWORD */}
            {/* <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div> */}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-11
                flex items-center justify-center gap-2
                rounded-lg
                bg-primary text-black font-semibold text-sm
                transition-all duration-200
                hover:bg-primary/90 hover:shadow-md
                active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-60
              ">
              {loading ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : null}
              <span>{loading ? "Signing In..." : "Sign In"}</span>
            </button>
          </form>

          {/* SIGNUP */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Create account
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Admin access?{" "}
            <Link to="/admin/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in as admin
            </Link>
          </p>
        </div>

        {/* TRUST */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
          <LuShieldCheck className="h-4 w-4 text-primary" />
          <span>Verified and secure platform</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
