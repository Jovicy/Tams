import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-playfair text-2xl font-extrabold text-primary">Tamara Jewelries</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground font-playfair">Reset password</h2>
          <p className="mt-2 text-sm text-muted-text">We’ll send a recovery link to your email.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button className="w-full h-11 rounded-lg bg-primary text-black font-semibold text-sm">Send recovery link</button>

          <p className="text-center text-sm text-muted-text">
            Back to{" "}
            <Link to="/login" className="text-primary">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
