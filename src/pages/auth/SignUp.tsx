import { LuShieldCheck } from "react-icons/lu";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-playfair text-2xl font-extrabold text-primary">
              Tamara Jewelries
            </span>
          </Link>

          <h2 className="mt-6 text-3xl font-bold text-foreground font-playfair">
            Create your account
          </h2>

          <p className="mt-2 text-sm text-muted-text">
            Join thousands of gold collectors
          </p>
        </div>

        {/* CARD */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">

          <form className="space-y-5">

            {/* FULL NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Adaeze Okonkwo"
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* PHONE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="08012345678"
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* BUTTON */}
            <button
              className="
                w-full h-12
                flex items-center justify-center
                rounded-lg
                bg-primary text-black font-semibold text-sm
                transition-all duration-200
                hover:bg-primary/90 hover:shadow-md
                active:scale-[0.98]
              "
            >
              Create Account
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-muted-text">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* TRUST */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
          <LuShieldCheck className="h-4 w-4 text-primary" />
          <span>Your data is safe with us</span>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
