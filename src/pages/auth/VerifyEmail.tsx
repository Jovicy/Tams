import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestEmailVerification, verifyEmailOtp } from "../../api/auth";
import { notifyError, notifyResponse } from "../../lib/notification";
import { refreshAuthUserProfile, useAuthStore } from "../../store/authStore";

function getSecondsRemaining(expiresAt?: string | null) {
  if (!expiresAt) return 0;

  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 1000));
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { session } = useAuthStore();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(session?.user?.emailVerificationOtpExpiresAt ?? null);
  const [secondsRemaining, setSecondsRemaining] = useState(() => getSecondsRemaining(session?.user?.emailVerificationOtpExpiresAt ?? null));

  function syncCountdown(nextExpiresAt: string | null) {
    setExpiresAt(nextExpiresAt);
    setSecondsRemaining(getSecondsRemaining(nextExpiresAt));
  }

  const formattedCountdown = useMemo(() => {
    const minutes = Math.floor(secondsRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsRemaining % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsRemaining]);

  useEffect(() => {
    const nextExpiresAt = session?.user?.emailVerificationOtpExpiresAt ?? null;
    syncCountdown(nextExpiresAt);
  }, [session?.user?.emailVerificationOtpExpiresAt]);

  useEffect(() => {
    if (session?.user?.isEmailVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, session?.user?.isEmailVerified]);

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsRemaining]);

  async function handleSendOtp() {
    setSending(true);

    try {
      const response = await requestEmailVerification();
      notifyResponse(response);

      const refreshedExpiry = response.data?.expiresAt ?? null;
      syncCountdown(refreshedExpiry);
    } catch (error) {
      notifyError(error, "Unable to send verification code.");
    } finally {
      setSending(false);
    }
  }

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!otp.trim()) {
      notifyError(new Error("Enter the verification code."));
      return;
    }

    setLoading(true);

    try {
      const response = await verifyEmailOtp({ otp: otp.trim() });
      notifyResponse(response);
      await refreshAuthUserProfile();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      notifyError(error, "Unable to verify email.");
    } finally {
      setLoading(false);
    }
  }

  const isExpired = secondsRemaining === 0 && Boolean(expiresAt);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-playfair text-2xl font-extrabold text-primary">Tamara Jewelries</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground font-playfair">Verify your email</h2>
          <p className="mt-2 text-sm text-muted-text">Enter the code sent to your inbox.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-5">
          <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-text">Code expires in</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{formattedCountdown}</p>
            {isExpired ? <p className="mt-1 text-xs text-red-400">Your code has expired. Request a new one.</p> : null}
          </div>

          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="verification-code">
                Verification code
              </label>
              <input
                id="verification-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="123456"
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button type="submit" disabled={loading || !otp.trim()} className="w-full h-11 rounded-lg bg-primary text-black font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Verifying..." : "Verify email"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sending}
            className="w-full h-11 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-background transition disabled:opacity-60 disabled:cursor-not-allowed">
            {sending ? "Sending..." : "Resend code"}
          </button>

          <p className="text-center text-sm text-muted-text">
            Didn\'t get it?{" "}
            <button type="button" onClick={handleSendOtp} className="text-primary hover:underline">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
