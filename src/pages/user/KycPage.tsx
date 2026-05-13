import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuCircleAlert, LuShieldCheck, LuClock, LuUpload } from "react-icons/lu";
import { refreshAuthUserProfile, useAuthStore } from "../../store/authStore";
import { notifyResponse } from "../../lib/notification";
import { submitKyc } from "../../api/users";

/* ---------------- TYPES ---------------- */
type Errors = {
  documentType?: string;
  file?: string;
};

const KycPage = () => {
  /* ---------------- STATE ---------------- */
  const [documentType, setDocumentType] = useState<string>("national_id_card");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { session } = useAuthStore();
  const hasSubmittedKyc = Boolean(session?.user?.isSubmittedKYC);
  const [submitted, setSubmitted] = useState<boolean>(hasSubmittedKyc);

  /* ---------------- VALIDATION ---------------- */
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!documentType) {
      newErrors.documentType = "Please select a document type";
    }

    if (!file) {
      newErrors.file = "Please upload a document file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await submitKyc({
        documentType,
        file: file!,
      });

      notifyResponse((res as any) ?? { message: "KYC submitted" }, "KYC submitted");

      setSubmitted(true);

      await refreshAuthUserProfile();

      navigate("/dashboard");
    } catch (error) {
      console.error("KYC submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* BACK BUTTON */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-text hover:text-primary mb-8 transition group">
        <LuArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">{hasSubmittedKyc ? "Complete your KYC verification" : "Identity Verification"}</h1>
        <p className="text-muted-text">{hasSubmittedKyc ? "Verify your identity to unlock all features" : "Verify your identity to unlock full platform access."}</p>
      </div>

      {/* STATUS ALERT */}
      {!submitted ? (
        <div className="rounded-xl p-5 border mb-8 flex items-start gap-4 bg-yellow-500/10 border-yellow-500/30">
          <LuCircleAlert className="h-6 w-6 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Not Submitted</p>
            <p className="text-sm text-muted-text mt-1">Submit your ID document to get verified.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-5 border mb-8 flex items-start gap-4 bg-blue-500/10 border-blue-500/30">
          <LuClock className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Under Review</p>
            <p className="text-sm text-muted-text mt-1">Your document is being reviewed. This usually takes 1–2 business days.</p>
            <p className="text-sm mt-2 text-foreground">
              Document Type: {documentType} • File: {fileName}
            </p>
          </div>
        </div>
      )}

      {/* FORM */}
      {!submitted && (
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="font-playfair text-xl font-bold text-foreground mb-6">Submit Your Document</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* only Document Type and File upload are shown */}

            {/* DOCUMENT TYPE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Document Type *</label>

              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="national_id_card">National ID Card</option>
                <option value="international_passport">International Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="voters_card">Voter's Card</option>
              </select>

              {errors.documentType && <p className="text-xs text-red-500">{errors.documentType}</p>}
            </div>

            {/* FILE UPLOAD */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Document File *</label>

              <div className="relative">
                <input type="file" onChange={handleFileChange} accept="image/*,.pdf" className="hidden" id="file-input" />

                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center w-full h-12 rounded-md border-2 border-dashed border-border bg-background/50 cursor-pointer hover:bg-background hover:border-primary transition">
                  <div className="flex items-center gap-2 text-sm">
                    <LuUpload className="h-4 w-4 text-muted-text" />
                    <span className="text-muted-text">{fileName ? fileName : "Click to upload or drag and drop"}</span>
                  </div>
                </label>
              </div>

              {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}

              <p className="text-xs text-muted-text">Supported formats: PNG, JPG, PDF (Max 5MB)</p>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" disabled={loading} className="w-full h-11 rounded-md bg-primary text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-60">
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
