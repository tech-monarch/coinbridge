import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Kyc.css";

const API = import.meta.env.VITE_API_DOMAIN;

const authHeaders = (isJson = true) => {
  const h: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
  };
  if (isJson) h["Content-Type"] = "application/json";
  return h;
};

/* ── Icons (unchanged) ── */
const IcoShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IcoCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IcoFile = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);
const IcoTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IcoUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

type KycStatus = "none" | "pending" | "approved" | "rejected";

/* ── Status Banner ── */
const StatusBanner: React.FC<{ status: KycStatus }> = ({ status }) => {
  if (status === "none") return null;
  const map = {
    pending: {
      icon: <IcoClock />,
      cls: "kyc-banner--pending",
      title: "Verification Pending",
      text: "Your documents are under review. This usually takes 1–3 business days.",
    },
    approved: {
      icon: <IcoCheck />,
      cls: "kyc-banner--approved",
      title: "Identity Verified",
      text: "Your account is fully verified. You have access to all features.",
    },
    rejected: {
      icon: <IcoX />,
      cls: "kyc-banner--rejected",
      title: "Verification Rejected",
      text: "Your submission was rejected. Please re-submit with clearer documents.",
    },
  };
  const cfg = map[status];
  return (
    <div className={`kyc-banner ${cfg.cls}`}>
      <div className="kyc-banner-icon">{cfg.icon}</div>
      <div>
        <p className="kyc-banner-title">{cfg.title}</p>
        <p className="kyc-banner-text">{cfg.text}</p>
      </div>
    </div>
  );
};

/* ── File Dropzone ── */
interface DropzoneProps {
  label: string;
  hint: string;
  file: File | null;
  onChange: (f: File | null) => void;
}
const Dropzone: React.FC<DropzoneProps> = ({ label, hint, file, onChange }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };
  return (
    <div className="kyc-field">
      <span className="dp-label">{label}</span>
      {file ? (
        <div className="kyc-file-preview">
          <IcoFile />
          <span className="kyc-file-name">{file.name}</span>
          <span className="kyc-file-size">{(file.size / 1024).toFixed(0)} KB</span>
          <button className="kyc-file-remove" onClick={() => onChange(null)}>
            <IcoTrash />
          </button>
        </div>
      ) : (
        <div
          className={`kyc-dropzone ${drag ? "kyc-dropzone--drag" : ""}`}
          onClick={() => ref.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >
          <IcoUpload />
          <p className="kyc-drop-main">Drop file here or <span>browse</span></p>
          <p className="kyc-drop-hint">{hint}</p>
          <input
            ref={ref}
            type="file"
            accept="image/*,.pdf"
            hidden
            onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0]); }}
          />
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
const Kyc: React.FC = () => {
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState<KycStatus>("none");
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [submitError, setSubmitError] = useState("");

  /* Step 1 */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");

  /* Step 2 */
  const [docType, setDocType] = useState("passport");
  const [frontDoc, setFrontDoc] = useState<File | null>(null);
  const [backDoc, setBackDoc] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch KYC status on mount
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const res = await fetch(`${API}/api/user/kyc/status`, {
          headers: authHeaders(),
        });
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        const data = await res.json();
        // Backend returns { kyc_status: '...', submission: {...} }
        const s: KycStatus = data.kyc_status ?? "none";
        setKycStatus(s);
        if (s === "pending" || s === "approved") setSubmitted(true);
      } catch (err) {
        console.error("KYC status fetch error:", err);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchKycStatus();
  }, [navigate]);

  const step1Valid = firstName && lastName && dob && country && address;
  const step2Valid = frontDoc && selfie;

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("date_of_birth", dob);    // ← was "dob", backend expects "date_of_birth"
      formData.append("country", country);
      formData.append("address", address);
      formData.append("document_type", docType); // ← was "doc_type", backend expects "document_type"
      if (frontDoc) formData.append("front_doc", frontDoc);
      if (backDoc) formData.append("back_doc", backDoc);
      if (selfie) formData.append("selfie", selfie);

      const res = await fetch(`${API}/api/user/kyc/submit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        // Flatten Laravel validation errors into a readable message
        const firstError =
          data.message ??
          Object.values(data.errors ?? {}).flat()[0] ??
          "Submission failed. Please check your documents and try again.";
        setSubmitError(firstError as string);
        return;
      }
      setKycStatus("pending");
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingStatus)
    return (
      <div className="kyc page-enter">
        <div className="page-hd"><h1>KYC Verification</h1></div>
        <p style={{ color: "var(--text-muted, #8b8b9a)", padding: "40px 0", textAlign: "center" }}>
          Loading verification status…
        </p>
      </div>
    );

  // Submitted / approved state
  if (submitted && kycStatus !== "rejected")
    return (
      <div className="kyc page-enter">
        <div className="page-hd">
          <h1>KYC Verification</h1>
          <p>Identity verification for your account</p>
        </div>
        <StatusBanner status={kycStatus === "approved" ? "approved" : "pending"} />
        {kycStatus !== "approved" && (
          <div className="kyc-submitted-card">
            <div className="kyc-submitted-icon"><IcoClock /></div>
            <h2>Documents Submitted</h2>
            <p>
              Your verification documents are being reviewed by our compliance
              team. You'll receive a notification once the process is complete.
            </p>
            <div className="kyc-submitted-steps">
              {["Documents submitted", "Compliance review", "Identity confirmed"].map((s, i) => (
                <div
                  key={i}
                  className={`kyc-track-step ${i === 0 ? "kyc-track-step--done" : i === 1 ? "kyc-track-step--active" : ""}`}
                >
                  <div className="kyc-track-dot" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

  return (
    <div className="kyc page-enter">
      <div className="page-hd">
        <h1>KYC Verification</h1>
        <p>Verify your identity to unlock full account access</p>
      </div>

      <StatusBanner status={kycStatus} />

      {/* Progress */}
      <div className="kyc-progress">
        {[{ n: 1, label: "Personal Info" }, { n: 2, label: "Documents" }].map(({ n, label }) => (
          <div
            key={n}
            className={`kyc-prog-step ${step === n ? "kyc-prog-step--active" : step > n ? "kyc-prog-step--done" : ""}`}
          >
            <div className="kyc-prog-dot">{step > n ? <IcoCheck /> : n}</div>
            <span>{label}</span>
          </div>
        ))}
        <div className="kyc-prog-line" />
      </div>

      {/* Step 1 — Personal Info */}
      {step === 1 && (
        <div className="kyc-card">
          <div className="kyc-card-hd">
            <IcoUser />
            <span>Personal Information</span>
          </div>
          <div className="kyc-form">
            <div className="kyc-row-2">
              <div className="input-wrap">
                <label className="input-label">First Name</label>
                <input
                  className="input-field"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-wrap">
                <label className="input-label">Last Name</label>
                <input
                  className="input-field"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="kyc-row-2">
              <div className="input-wrap">
                <label className="input-label">Date of Birth</label>
                <input
                  className="input-field"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="input-wrap">
                <label className="input-label">Country</label>
                <select
                  className="input-field kyc-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Select country</option>
                  {[
                    "United States", "United Kingdom", "Canada", "Australia",
                    "Germany", "France", "Nigeria", "South Africa", "India", "Singapore",
                  ].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="input-wrap">
              <label className="input-label">Residential Address</label>
              <input
                className="input-field"
                placeholder="123 Main Street, City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="kyc-card-footer">
            <button className="wd-btn-primary" disabled={!step1Valid} onClick={() => setStep(2)}>
              Continue to Documents
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Documents */}
      {step === 2 && (
        <div className="kyc-card">
          <div className="kyc-card-hd">
            <IcoShield />
            <span>Identity Documents</span>
          </div>
          <div className="kyc-form">
            <div className="input-wrap">
              <label className="input-label">Document Type</label>
              <select
                className="input-field kyc-select"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <option value="passport">Passport</option>
                <option value="national_id">National ID</option>
                <option value="drivers_license">Driver's License</option>
              </select>
            </div>
            <Dropzone
              label={`${docType === "passport" ? "Passport" : docType === "national_id" ? "National ID" : "Driver's License"} — Front`}
              hint="JPG, PNG or PDF · Max 5MB"
              file={frontDoc}
              onChange={setFrontDoc}
            />
            {docType !== "passport" && (
              <Dropzone
                label="Document — Back"
                hint="JPG, PNG or PDF · Max 5MB"
                file={backDoc}
                onChange={setBackDoc}
              />
            )}
            <Dropzone
              label="Selfie with Document"
              hint="Hold your document next to your face · JPG or PNG"
              file={selfie}
              onChange={setSelfie}
            />
            {submitError && <div className="auth-error">{submitError}</div>}
          </div>
          <div className="kyc-card-footer kyc-card-footer--split">
            <button className="wd-btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button
              className="wd-btn-primary"
              disabled={!step2Valid || loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="wd-spinner" />
              ) : (
                <><IcoShield /> Submit Verification</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Why verify */}
      <div className="kyc-unlock-card">
        <p className="kyc-unlock-title">Why verify?</p>
        <div className="kyc-unlock-items">
          {[
            "Unlimited withdrawal limits",
            "Full account access",
            "Enhanced security protections",
            "Regulatory compliance",
          ].map((item) => (
            <div key={item} className="kyc-unlock-item">
              <span className="kyc-unlock-dot"><IcoCheck /></span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kyc;