import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";
import SocialButton from "../Components/Socialbutton";
import PhoneInput from "../Components/Phoneinput";
import FormInput from "../Components/Forminput";
import { loginUser } from "../auth.slice";
//import { signInWithGoogle } from "../utils/firebaseAuth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{7,15}$/;

/* ─── Shared UI ─────────────────────────────────────────────────────────── */

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
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
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

function FieldLabel({ text, required, onForgot }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="block text-sm font-medium" style={{ color: "#061E29" }}>
        {text}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {onForgot && (
        <button
          type="button"
          onClick={onForgot}
          className="text-xs font-medium hover:underline"
          style={{ color: "#1D546D" }}
        >
          Forgot Password?
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FORGOT PASSWORD MODAL
   ─ Collects phone or email
   ─ Calls POST /api/send-phone-otp or POST /api/send-email-otp
   ─ On success → navigate to /auth/otp with { type, identifier, flow:"forgot" }
   ══════════════════════════════════════════════════════════════════════════ */
function ForgotPasswordModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState("phone"); // "phone" | "email"
  const [phone, setPhone] = useState({ full: "", raw: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const errs = {};
    if (tab === "phone") {
      if (!phone.full || !phoneRegex.test(phone.full))
        errs.phone = "Enter a valid mobile number";
    } else {
      if (!email || !emailRegex.test(email))
        errs.email = "Enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setApiError("");
    setLoading(true);

    try {
      const endpoint =
        tab === "phone" ? "/api/send-phone-otp" : "/api/send-email-otp";
      const body =
        tab === "phone"
          ? { phoneNumber: phone.full, flow: "forgot-password" }
          : { email, flow: "forgot-password" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Failed to send OTP. Please try again.");
        return;
      }

      // ✅ OTP sent → hand off to OTP page with "forgot" flow marker
      onSuccess({
        type: tab,
        identifier: tab === "phone" ? phone.full : email,
        flow: "forgot-password",
      });
    } catch {
      setApiError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,30,41,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ background: "#ffffff" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#061E29" }}>
              Reset Password
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#5F9598" }}>
              We'll send an OTP to verify your identity
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            style={{ color: "#5F9598" }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-5" style={{ background: "#F3F4F4" }}>
          {[{ key: "phone", label: "Mobile" }, { key: "email", label: "Email" }].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setTab(key); setErrors({}); setApiError(""); }}
              className="flex-1 py-2 text-sm rounded-lg transition-all duration-200"
              style={{
                background: tab === key ? "#ffffff" : "transparent",
                color: tab === key ? "#1D546D" : "#5F9598",
                border: tab === key ? "1px solid #e5e7eb" : "1px solid transparent",
                fontWeight: tab === key ? 600 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Field */}
        {tab === "phone" ? (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#061E29" }}>
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <PhoneInput
              value={phone}
              onChange={(full, raw) => setPhone({ full, raw })}
              error={errors.phone}
            />
          </div>
        ) : (
          <div className="mb-4">
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
        )}

        {/* API-level error */}
        {apiError && (
          <p className="text-xs text-red-500 mb-3 -mt-2">{apiError}</p>
        )}

        <PrimaryBtn onClick={handleSend} disabled={loading}>
          {loading ? <><Spinner /> Sending OTP…</> : "Send OTP"}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LOGIN PAGE
   ══════════════════════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const [mode, setMode] = useState("phone"); // "phone" | "email"

  /* Phone tab */
  const [phone, setPhone] = useState({ full: "", raw: "" });
  const [phonePassword, setPhonePass] = useState("");

  /* Email tab */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [socialLoading, setSocialLoading] = useState(null);
  const [showForgot, setShowForgot] = useState(false);

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (mode === "phone") {
      if (!phone.full || !phoneRegex.test(phone.full))
        errs.phone = "Enter a valid mobile number";
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

  /* ── Submit (phone / email) ── */
  const handleLogin = async () => {
    if (!validate()) return;

    if (mode === "phone") {
      const result = await dispatch(
        loginUser({ phoneNumber: phone.full, password: phonePassword, provider: "phone" })
      );
      if (loginUser.fulfilled.match(result)) {
        navigate("/");
      } else {
        setErrors({ phone: result.payload?.message || "Invalid phone or password" });
      }
    } else {
      const result = await dispatch(
        loginUser({ email, password, provider: "email" })
      );
      if (loginUser.fulfilled.match(result)) {
        navigate("/");
      } else {
        setErrors({
          email: result.payload?.message || "",
          password: result.payload?.message || "Invalid email or password",
        });
      }
    }
  };

  /* ── Google Sign-In via Firebase popup → POST /api/user-signup ── */
  const handleGoogle = async () => {
    setSocialLoading("google");
    try {
      // 1. Firebase opens the Google account-picker popup
      const { idToken } = await signInWithGoogle();

      // 2. Send Firebase id_token to your backend — it verifies with Firebase Admin SDK
      //    and upserts the user (register if new, login if existing)
      const res = await fetch("/api/user-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ google: data.message || "Google sign-in failed" });
        return;
      }

      // 3. Sync your app's token/user into Redux auth state
      await dispatch(
        loginUser.fulfilled(
          { user: data.user, token: data.token },
          "google-firebase",
          { provider: "google" }
        )
      );

      navigate("/");
    } catch (err) {
      // auth/popup-closed-by-user → user just closed the popup, no need to alarm them
      if (err?.code !== "auth/popup-closed-by-user") {
        setErrors({ google: err.message || "Google sign-in failed" });
      }
    } finally {
      setSocialLoading(null);
    }
  };

  /* ── Forgot password OTP success ── */
  const handleForgotSuccess = ({ type, identifier, flow }) => {
    setShowForgot(false);
    navigate("/auth/otp", { state: { type, identifier, flow } });
  };

  /* ── Tab switch ── */
  const switchMode = (tab) => {
    setMode(tab);
    setErrors({});
    setPhone({ full: "", raw: "" });
    setPhonePass("");
    setEmail("");
    setPassword("");
  };

  /* ── Render ── */
  return (
    <AuthLayout>

      {/* Forgot-password modal */}
      {showForgot && (
        <ForgotPasswordModal
          onClose={() => setShowForgot(false)}
          onSuccess={handleForgotSuccess}
        />
      )}

      {/* Header */}
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#5F9598" }}>
          Welcome back
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "#061E29" }}>
          Login to <span style={{ color: "#1D546D" }}>Tijara</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5F9598" }}>
          New to eClassify?{" "}
          <a href="/auth/signup" style={{ color: "#1D546D" }} className="font-semibold hover:underline">
            Create an account
          </a>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl p-1 mb-6" style={{ background: "#F3F4F4" }}>
        {[{ key: "phone", label: "Mobile" }, { key: "email", label: "Email" }].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => switchMode(key)}
            className="flex-1 py-2 text-sm rounded-lg transition-all duration-200"
            style={{
              background: mode === key ? "#ffffff" : "transparent",
              color: mode === key ? "#1D546D" : "#5F9598",
              border: mode === key ? "1px solid #e5e7eb" : "1px solid transparent",
              fontWeight: mode === key ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Global Google error */}
      {errors.google && (
        <p className="text-xs text-red-500 mb-3 text-center">{errors.google}</p>
      )}

      {/* ── MOBILE TAB ── */}
      {mode === "phone" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#061E29" }}>
              Mobile Number <span className="text-red-400">*</span>
            </label>
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
              onForgot={() => setShowForgot(true)}
            />
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
            {loading ? <><Spinner /> Logging in…</> : "Continue"}
          </PrimaryBtn>

          <Divider />

          <SocialButton
            provider="google"
            onClick={handleGoogle}
            loading={socialLoading === "google"}
          />
        </div>
      )}

      {/* ── EMAIL TAB ── */}
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
              onForgot={() => setShowForgot(true)}
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
        <a href="/terms" style={{ color: "#1D546D" }} className="hover:underline">Terms of Service</a>
        {" "}and{" "}
        <a href="/privacy" style={{ color: "#1D546D" }} className="hover:underline">Privacy Policy</a>
      </p>

    </AuthLayout>
  );
}