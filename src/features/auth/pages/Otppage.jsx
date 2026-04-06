import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";
import OtpInput from "../Components/OtpInput";
import {
  verifyPhoneOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  sendEmailOTP,
} from "../auth.slice" // adjust import path

const RESEND_SECONDS = 30;

export default function OtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { loading } = useSelector((s) => s.auth);

  const type = state?.type || "phone";
  const identifier = state?.identifier || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length < 6) { setError("Please enter the 6-digit OTP"); return; }
    setError("");
    const action =
      type === "phone"
        ? verifyPhoneOTP({ phoneNumber: identifier, otp })
        : verifyEmailOTP({ email: identifier, otp });
    const result = await dispatch(action);
    if (verifyPhoneOTP.fulfilled.match(result) || verifyEmailOTP.fulfilled.match(result)) {
      setVerified(true);
      setTimeout(() => navigate("/"), 1200);
    } else {
      setError(result.payload?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    const action =
      type === "phone"
        ? sendPhoneOTP({ phoneNumber: identifier })
        : sendEmailOTP({ email: identifier });
    await dispatch(action);
    setResending(false);
    setCountdown(RESEND_SECONDS);
  };

  const masked =
    type === "phone"
      ? identifier.replace(/(\+\d{2})\d+(\d{4})$/, "$1••••••$2")
      : identifier.replace(/(.{2}).+(@.+)/, "$1••••$2");

  return (
    <AuthLayout>
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

      <div className="mb-8 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "#F3F4F4" }}
        >
          {type === "phone" ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#1D546D" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#1D546D" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#5F9598" }}>
          Verification
        </p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#061E29" }}>Enter OTP</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#5F9598" }}>
          We sent a 6-digit code to
          <br />
          <span className="font-semibold" style={{ color: "#1D546D" }}>{masked}</span>
        </p>
      </div>

      <div className="mb-6">
        <OtpInput length={6} onChange={setOtp} />
        {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || verified}
        className="w-full py-3.5 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm text-white"
        style={{
          background: verified ? "#22c55e" : "#1D546D",
          opacity: loading || verified ? 0.85 : 1,
          cursor: loading || verified ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => { if (!loading && !verified) e.currentTarget.style.background = "#061E29"; }}
        onMouseLeave={(e) => { if (!loading && !verified) e.currentTarget.style.background = verified ? "#22c55e" : "#1D546D"; }}
      >
        {verified ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Verified!
          </>
        ) : loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Verifying…
          </>
        ) : "Verify OTP"}
      </button>

      <div className="mt-5 text-center">
        {countdown > 0 ? (
          <p className="text-sm" style={{ color: "#5F9598" }}>
            Resend code in{" "}
            <span className="font-semibold" style={{ color: "#1D546D" }}>
              {String(Math.floor(countdown / 60)).padStart(2, "0")}:
              {String(countdown % 60).padStart(2, "0")}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-medium transition-colors"
            style={{ color: "#1D546D", opacity: resending ? 0.5 : 1 }}
          >
            {resending ? "Resending…" : "Resend OTP"}
          </button>
        )}
      </div>

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