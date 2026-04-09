/**
 * LoginPage.jsx
 *
 * Mobile tab : phone + password → POST /api/send-phone-otp → /auth/otp
 * Email tab  : email + password → POST /api/user-signup { provider:"email" } → /
 * Google     : Firebase idToken → POST /api/user-signup { provider:"google" } → /
 */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import SocialButton from "../components/Socialbutton";
import PhoneInput from "../components/Phoneinput";
import FormInput from "../components/Forminput";
import { loginUser, sendPhoneOTP } from "../services/auth.slice";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{7,15}$/;

/* ─── UI helpers ──────────────────────────────────────── */

function PrimaryBtn({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3.5 font-semibold rounded-xl transition-all duration-200
                 flex items-center justify-center gap-2 text-sm text-white"
      style={{
        background: disabled ? "#5F9598" : "#1D546D",
        cursor:     disabled ? "not-allowed" : "pointer",
        opacity:    disabled ? 0.7 : 1,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "#061E29"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = "#1D546D"; }}
    >
      {children}
    </button>
  );
}

function Divider({ label = "OR CONTINUE WITH" }) {
  return (
    <div className="relative flex items-center gap-3 my-2">
      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
      <span className="text-xs font-medium" style={{ color: "#5F9598" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function ApiErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm"
         style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

function FieldLabel({ text, required, onForgot }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="block text-sm font-medium" style={{ color: "#061E29" }}>
        {text}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {onForgot && (
        <button type="button" onClick={onForgot}
          className="text-xs font-medium hover:underline" style={{ color: "#1D546D" }}>
          Forgot Password?
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOGIN PAGE
   ══════════════════════════════════════════════════════ */
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const [mode, setMode] = useState("phone");    // "phone" | "email"

  /* Phone tab */
  const [phone, setPhone]             = useState({ full: "", raw: "" });
  const [phonePassword, setPhonePass] = useState("");

  /* Email tab */
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors]               = useState({});
  const [apiError, setApiError]           = useState("");
  const [socialLoading, setSocialLoading] = useState(null);

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (mode === "phone") {
      if (!phone.full || !phoneRegex.test(phone.full))
        errs.phone = "Enter a valid mobile number with country code";
      if (!phonePassword || phonePassword.length < 6)
        errs.phonePassword = "Password must be at least 6 characters";
    } else {
      if (!email || !emailRegex.test(email))
        errs.email = "Enter a valid email address";
      if (!password || password.length < 6)
        errs.password = "Password must be at least 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ── */
  const handleLogin = async () => {
    setApiError("");
    if (!validate()) return;

    if (mode === "phone") {
      /**
       * POST /api/send-phone-otp
       * Body: { phoneNumber, password }
       * Backend validates password then sends OTP.
       * On success → /auth/otp
       */
      const result = await dispatch(
        sendPhoneOTP({ phoneNumber: phone.full, password: phonePassword })
      );
      if (sendPhoneOTP.fulfilled.match(result)) {
        navigate("/auth/otp", {
          state: { type: "phone", identifier: phone.full },
        });
      } else {
        setApiError(result.payload?.message || "Failed to send OTP. Please try again.");
      }

    } else {
      /**
       * POST /api/user-signup
       * Body: { provider: "email", email, password }
       * Direct credential login — no OTP step.
       * On success → token saved → navigate to "/"
       */
      const result = await dispatch(
        loginUser({ provider: "email", email, password })
      );
      if (loginUser.fulfilled.match(result)) {
        navigate("/");
      } else {
        setApiError(result.payload?.message || "Invalid email or password.");
      }
    }
  };

  /* ── Google ── */
  const handleGoogle = async () => {
    setSocialLoading("google");
    setApiError("");
    try {
      /**
       * Requires Firebase:  npm install firebase
       * import { signInWithGoogle } from "../utils/firebaseAuth";
       * const { idToken } = await signInWithGoogle();
       *
       * POST /api/user-signup { provider: "google", idToken }
       */
      
      
      const { signInWithGoogle } = await import("firebase/auth");
      const { idToken } = await signInWithGoogle();
      const result = await dispatch(loginUser({ provider: "google", idToken }));
      if (loginUser.fulfilled.match(result)) {
        navigate("/");
      } else {
        setApiError(result.payload?.message || "Google sign-in failed.");
      }
    } catch (err) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setApiError(err.message || "Google sign-in failed.");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  /* ── Switch tab ── */
  const switchMode = (tab) => {
    setMode(tab);
    setErrors({});
    setApiError("");
    setPhone({ full: "", raw: "" });
    setPhonePass("");
    setEmail("");
    setPassword("");
  };

  /* ── Render ── */
  return (
    <AuthLayout>

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#5F9598" }}>
          Welcome back
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "#061E29" }}>
          Login to <span style={{ color: "#1D546D" }}>eClassify</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5F9598" }}>
          New to eClassify?{" "}
          <a href="/auth/signup" style={{ color: "#1D546D" }} className="font-semibold hover:underline">
            Create an account
          </a>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl p-1 mb-5" style={{ background: "#F3F4F4" }}>
        {[{ key: "phone", label: "Mobile" }, { key: "email", label: "Email" }].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => switchMode(key)}
            className="flex-1 py-2 text-sm rounded-lg transition-all duration-200"
            style={{
              background: mode === key ? "#ffffff"           : "transparent",
              color:      mode === key ? "#1D546D"           : "#5F9598",
              border:     mode === key ? "1px solid #e5e7eb" : "1px solid transparent",
              fontWeight: mode === key ? 600                 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* API-level error */}
      {apiError && (
        <div className="mb-4">
          <ApiErrorBanner message={apiError} />
        </div>
      )}

      {/* ══════════════════════════════════════════
          MOBILE TAB
          ● PhoneInput  – phone number (country selector)
          ● FormInput   – password (plain <input type="password">)
          Action: POST /api/send-phone-otp → /auth/otp
         ══════════════════════════════════════════ */}
      {mode === "phone" && (
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#061E29" }}>
              Mobile Number <span className="text-red-400">*</span>
            </label>
            {/* PhoneInput = country selector + tel input. */}
            <PhoneInput
              value={phone}
              onChange={(full, raw) => setPhone({ full, raw })}
              error={errors.phone}
            />
          </div>

          <div>
            <FieldLabel
              text="Password"
              required
              onForgot={() => navigate("/auth/forgot-password")}
            />
            {/* FormInput = plain <input type="password">. No country code. */}
            <FormInput
              type="password"
              placeholder="Enter your password"
              value={phonePassword}
              onChange={(e) => setPhonePass(e.target.value)}
              error={errors.phonePassword}
              autoComplete="current-password"
            />
          </div>

          <PrimaryBtn onClick={handleLogin} disabled={loading}>
            {loading ? <><Spinner /> Sending OTP…</> : "Continue"}
          </PrimaryBtn>

          <Divider />

          <SocialButton
            provider="google"
            onClick={handleGoogle}
            loading={socialLoading === "google"}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════
          EMAIL TAB
          ● FormInput – email    (type="email")
          ● FormInput – password (type="password")
          Action: POST /api/user-signup { provider:"email" } → /
         ══════════════════════════════════════════ */}
      {mode === "email" && (
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#061E29" }}>
              Email Address <span className="text-red-400">*</span>
            </label>
            <FormInput
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
          </div>

          <div>
            <FieldLabel
              text="Password"
              required
              onForgot={() => navigate("/auth/forgot-password")}
            />
            <FormInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />
          </div>

          <PrimaryBtn onClick={handleLogin} disabled={loading}>
            {loading ? <><Spinner /> Logging in…</> : "Login"}
          </PrimaryBtn>

          <Divider />

          <SocialButton
            provider="google"
            onClick={handleGoogle}
            loading={socialLoading === "google"}
          />
        </div>
      )}

      {/* Terms */}
      <p className="mt-6 text-center text-xs" style={{ color: "#5F9598" }}>
        By signing in you agree to eClassify's{" "}
        <a href="/terms"   style={{ color: "#1D546D" }} className="hover:underline">Terms of Service</a>
        {" "}and{" "}
        <a href="/privacy" style={{ color: "#1D546D" }} className="hover:underline">Privacy Policy</a>
      </p>

    </AuthLayout>
  );
}