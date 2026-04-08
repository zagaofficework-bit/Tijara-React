/**
 * OtpPage.jsx
 *
 * Receives location.state from both Login and Signup pages:
 *   { type: "phone" | "email", identifier, username?, password? }
 *
 * Phone verify  : POST /api/verify-phone-otp  { phoneNumber, otp }
 * Email verify  : POST /api/verify-email-otp  { email, otp, username, password }
 *
 * Resend phone  : POST /api/send-phone-otp    { phoneNumber }
 * Resend email  : POST /api/send-email-otp    { email, username, password }
 */
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import {
  verifyPhoneOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  sendEmailOTP,
} from "../services/auth.slice";

const RESEND_SECONDS = 30;
const OTP_LENGTH = 6;

/* ─── Inline OTP input ──────────────────────────────── */
function OtpBoxes({ value, onChange, disabled }) {
  const values  = value.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
  const refs    = useRef([]);

  const update = (idx, char) => {
    const next = values.map((v, i) => (i === idx ? char : v)).join("").slice(0, OTP_LENGTH);
    onChange(next);
    if (char && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
  };

  const handleKey = (idx, e) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    onChange(pasted.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH).trimEnd());
    refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          disabled={disabled}
          onChange={(e) => update(i, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-11 h-13 text-center text-xl font-bold rounded-xl outline-none
                     transition-all duration-200"
          style={{
            width: "clamp(40px, 12vw, 52px)",
            height: "clamp(48px, 14vw, 60px)",
            border:      v ? "2px solid #1D546D" : "1.5px solid #d1d5db",
            background:  v ? "#F3F4F4"           : "#ffffff",
            color:       "#061E29",
            boxShadow:   v ? "0 0 0 3px rgba(29,84,109,0.1)" : "none",
            opacity:     disabled ? 0.6 : 1,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Spinner ───────────────────────────────────────── */
function Spinner({ size = 4 }) {
  return (
    <svg className={`w-${size} h-${size} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   OTP PAGE
   ══════════════════════════════════════════════════════ */
export default function OtpPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { state } = useLocation();
  const { loading } = useSelector((s) => s.auth);

  /* Pull everything from navigate state */
  const type       = state?.type       || "phone";
  const identifier = state?.identifier || "";
  const username   = state?.username   || "";
  const password   = state?.password   || "";

  const [otp, setOtp]           = useState("");
  const [error, setError]       = useState("");
  const [apiError, setApiError] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const [verified, setVerified]   = useState(false);

  /* ── Countdown timer ── */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  /* ── Redirect if no identifier ── */
  useEffect(() => {
    if (!identifier) navigate("/auth/login");
  }, [identifier, navigate]);

  /* ── Verify ── */
  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit code`);
      return;
    }
    setError("");
    setApiError("");

    let result;
    if (type === "phone") {
      /**
       * POST /api/verify-phone-otp
       * Body: { phoneNumber: identifier, otp }
       * Returns: { token, user }
       */
      result = await dispatch(verifyPhoneOTP({ phoneNumber: identifier, otp }));
    } else {
      /**
       * POST /api/verify-email-otp
       * Body: { email: identifier, otp, username, password }
       * Returns: { token, user }
       */
      result = await dispatch(verifyEmailOTP({ email: identifier, otp, username, password }));
    }

    const matched =
      verifyPhoneOTP.fulfilled.match(result) ||
      verifyEmailOTP.fulfilled.match(result);

    if (matched) {
      setVerified(true);
      setTimeout(() => navigate("/"), 1200);
    } else {
      setApiError(result.payload?.message || "Invalid OTP. Please try again.");
    }
  };

  /* ── Resend ── */
  const handleResend = async () => {
    setResending(true);
    setError("");
    setApiError("");
    setOtp("");

    if (type === "phone") {
      // POST /api/send-phone-otp  { phoneNumber: identifier }
      await dispatch(sendPhoneOTP({ phoneNumber: identifier }));
    } else {
      // POST /api/send-email-otp  { email: identifier, username, password }
      await dispatch(sendEmailOTP({ email: identifier, username, password }));
    }

    setResending(false);
    setCountdown(RESEND_SECONDS);
  };

  /* ── Masked identifier display ── */
  const masked =
    type === "phone"
      ? identifier.replace(/(\+\d{2})\d+(\d{4})$/, "$1••••••$2")
      : identifier.replace(/(.{2}).+(@.+)/, "$1••••$2");

  /* ── Timer display ── */
  const timerLabel = `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;

  /* ── Render ── */
  return (
    <AuthLayout>

      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm mb-6 -ml-1 transition-colors"
        style={{ color: "#5F9598" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1D546D")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#5F9598")}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-8 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "#F3F4F4" }}
        >
          {type === "phone" ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#1D546D" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#1D546D" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#5F9598" }}>
          Verification
        </p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#061E29" }}>Enter OTP</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#5F9598" }}>
          We sent a {OTP_LENGTH}-digit code to
          <br />
          <span className="font-semibold" style={{ color: "#1D546D" }}>{masked}</span>
        </p>
      </div>

      {/* OTP boxes */}
      <div className="mb-5">
        <OtpBoxes
          value={otp}
          onChange={(v) => { setOtp(v); setError(""); setApiError(""); }}
          disabled={loading || verified}
        />

        {/* Field-level error */}
        {error && (
          <p className="mt-3 text-center text-xs text-red-500">{error}</p>
        )}

        {/* API-level error */}
        {apiError && (
          <div className="mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-sm"
               style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}
      </div>

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || verified || otp.length < OTP_LENGTH}
        className="w-full py-3.5 font-semibold rounded-xl transition-all duration-300
                   flex items-center justify-center gap-2 text-sm text-white"
        style={{
          background: verified ? "#22c55e" : "#1D546D",
          opacity: (loading || verified || otp.length < OTP_LENGTH) ? 0.75 : 1,
          cursor:  (loading || verified || otp.length < OTP_LENGTH) ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!loading && !verified && otp.length >= OTP_LENGTH)
            e.currentTarget.style.background = "#061E29";
        }}
        onMouseLeave={(e) => {
          if (!loading && !verified)
            e.currentTarget.style.background = verified ? "#22c55e" : "#1D546D";
        }}
      >
        {verified ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Verified!
          </>
        ) : loading ? (
          <><Spinner /> Verifying…</>
        ) : "Verify OTP"}
      </button>

      {/* Resend */}
      <div className="mt-5 text-center">
        {countdown > 0 ? (
          <p className="text-sm" style={{ color: "#5F9598" }}>
            Resend code in{" "}
            <span className="font-semibold" style={{ color: "#1D546D" }}>{timerLabel}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-medium transition-colors hover:underline"
            style={{ color: "#1D546D", opacity: resending ? 0.5 : 1 }}
          >
            {resending ? (
              <span className="flex items-center gap-1.5 justify-center">
                <Spinner size={3} /> Resending…
              </span>
            ) : "Resend OTP"}
          </button>
        )}
      </div>

      {/* Change identifier */}
      <p className="mt-4 text-center text-sm" style={{ color: "#5F9598" }}>
        Wrong {type === "phone" ? "number" : "email"}?{" "}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="font-medium hover:underline"
          style={{ color: "#1D546D" }}
        >
          Change it
        </button>
      </p>

    </AuthLayout>
  );
}