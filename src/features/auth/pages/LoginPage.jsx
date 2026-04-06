import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";
import SocialButton from "../Components/Socialbutton";
import PhoneInput from "../Components/Phoneinput";   // ← ONLY for the phone number field
import FormInput from "../Components/Forminput";     // ← for ALL text / email / password fields
import { loginUser } from "../auth.slice";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{7,15}$/;

/* ─── shared UI helpers ─────────────────────────────── */

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

/* ─── Label row with optional "Forgot Password?" link ── */
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

/* ══════════════════════════════════════════════════════
   LOGIN PAGE
   ══════════════════════════════════════════════════════ */
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

  /* ── Submit ── */
  const handleLogin = async () => {
    if (!validate()) return;

    if (mode === "phone") {
      /**
       * POST /api/send-phone-otp
       * Body: { phoneNumber, password }
       * Backend validates password then issues OTP → navigate to /auth/otp
       */
      const result = await dispatch(
        loginUser({
          phoneNumber: phone.full,
          password: phonePassword,
          provider: "phone", // ✅ important for backend
        })
      );

      if (loginUser.fulfilled.match(result)) {
        navigate("/"); // ✅ direct to home
      } else {
        setErrors({
          phone: result.payload?.message || "Invalid phone or password",
        });
      }

    } else {
      const result = await dispatch(
        loginUser({
          email,
          password,
          provider: "email", // ✅ keep this
        })
      );

      if (loginUser.fulfilled.match(result)) {
        navigate("/"); // ✅ direct login
      } else {
        setErrors({
          email: result.payload?.message || "",
          password: result.payload?.message || "Invalid email or password",
        });
      }
    }
  };

  const handleSocial = async (provider) => {
    setSocialLoading(provider);
    try {
      const result = await dispatch(loginUser({ provider }));
      if (loginUser.fulfilled.match(result)) navigate("/");
    } finally {
      setSocialLoading(null);
    }
  };

  /* Reset everything when switching tabs */
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

      {/* ══════════════════════════════════════════
          MOBILE TAB
          ● PhoneInput  → phone number with country code
          ● FormInput   → password  (plain text input, NO country selector)
          Action: POST /api/send-phone-otp → /auth/otp
         ══════════════════════════════════════════ */}
      {mode === "phone" && (
        <div className="space-y-4">

          {/* Mobile number — uses PhoneInput (country selector + tel field) */}
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

          {/* Password — uses FormInput (plain input, type="password") */}
          <div>
            <FieldLabel
              text="Password"
              required
              onForgot={() => navigate("/auth/forgot-password")}
            />
            {/*
              ✅ FormInput renders a plain <input type="password">
              It has NO PhoneInput inside it.
            */}
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
            onClick={() => handleSocial("google")}
            loading={socialLoading === "google"}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════
          EMAIL TAB
          ● FormInput  → email address  (type="email")
          ● FormInput  → password       (type="password")
          Action: POST /api/user-signup → home "/"  (no OTP)
         ══════════════════════════════════════════ */}
      {mode === "email" && (
        <div className="space-y-4">

          {/* Email — plain input, type="email" */}
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

          {/* Password — plain input, type="password" */}
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
            onClick={() => handleSocial("google")}
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