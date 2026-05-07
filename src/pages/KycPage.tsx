import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowLeft,
  LuCircleAlert,
  LuShieldCheck,
  LuClock,
} from "react-icons/lu";

/* ---------------- TYPES ---------------- */
type Errors = {
  docNumber?: string;
  docUrl?: string;
};

const KycPage = () => {
  /* ---------------- STATE ---------------- */
  const [docType, setDocType] = useState<string>("National ID Card");
  const [docNumber, setDocNumber] = useState<string>("");
  const [docUrl, setDocUrl] = useState<string>("");

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  /* ---------------- VALIDATION ---------------- */
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!docNumber || docNumber.length < 6) {
      newErrors.docNumber = "Enter a valid document number";
    }

    if (!docUrl || !docUrl.startsWith("http")) {
      newErrors.docUrl = "Enter a valid document URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    // simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">

      {/* BACK BUTTON */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-muted-text hover:text-primary mb-8 transition group"
      >
        <LuArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
          Identity Verification
        </h1>
        <p className="text-muted-text">
          Verify your identity to unlock full platform access.
        </p>
      </div>

      {/* STATUS ALERT */}
      {!submitted ? (
        <div className="rounded-xl p-5 border mb-8 flex items-start gap-4 bg-yellow-500/10 border-yellow-500/30">
          <LuCircleAlert className="h-6 w-6 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">
              Not Submitted
            </p>
            <p className="text-sm text-muted-text mt-1">
              Submit your ID document to get verified.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-5 border mb-8 flex items-start gap-4 bg-blue-500/10 border-blue-500/30">
          <LuClock className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">
              Under Review
            </p>
            <p className="text-sm text-muted-text mt-1">
              Your document is being reviewed. This usually takes 1–2 business days.
            </p>
            <p className="text-sm mt-2 text-foreground">
              Document: {docType} — {docNumber}
            </p>
          </div>
        </div>
      )}

      {/* FORM */}
      {!submitted && (
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="font-playfair text-xl font-bold text-foreground mb-6">
            Submit Your Document
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* DOCUMENT TYPE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Document Type
              </label>

              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option>National ID Card</option>
                <option>International Passport</option>
                <option>Driver's License</option>
                <option>Voter's Card</option>
              </select>
            </div>

            {/* DOCUMENT NUMBER */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Document Number
              </label>

              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. A12345678"
                className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />

              {errors.docNumber && (
                <p className="text-xs text-red-500">
                  {errors.docNumber}
                </p>
              )}
            </div>

            {/* DOCUMENT URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Document URL
              </label>

              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />

              {errors.docUrl && (
                <p className="text-xs text-red-500">
                  {errors.docUrl}
                </p>
              )}

              <p className="text-xs text-muted-text">
                Upload your document to Google Drive or any file sharing service and paste the link here.
              </p>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-md bg-primary text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit for Review"}
            </button>

          </form>
        </div>
      )}

      {/* FOOTER NOTE */}
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground justify-center">
        <LuShieldCheck className="h-4 w-4 text-primary" />
        <span>Your documents are reviewed manually for your safety</span>
      </div>
    </div>
  );
};

export default KycPage;