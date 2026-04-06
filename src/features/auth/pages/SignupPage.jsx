import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";
import SocialButton from "../Components/Socialbutton";
import PhoneInput from "../Components/Phoneinput";
import FormInput from "../Components/Forminput";
import { sendPhoneOTP, sendEmailOTP } from "../auth.slice";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{7,15}$/;

function PrimaryBtn({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3.5 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm text-white"
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

function Divider() {
  return (
    <div className="relative flex items-center gap-3 my-2">
      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
      <span className="text-xs font-medium" style={{ color: "#5F9598" }}>OR CONTINUE WITH</span>
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

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const [mode, setMode] = useState("phone"); // "phone" | "email"

  // Phone state
  const [phone, setPhone] = useState({ full: "", raw: "" });
  const [phonePassword, setPhonePassword] = useState("");

  // Email state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [socialLoading, setSocialLoading] = useState(null);

  const validate = () => {
    const errs = {};
    if (mode === "phone") {
      if (!phone.full || !phoneRegex.test(phone.full))
        errs.phone = "Enter a valid phone number";

      if (!phonePassword || phonePassword.length < 6)
        errs.phonePassword = "Password must be at least 6 characters"; // ✅ ADD THIS
    } else {
      if (!username.trim() || username.trim().length < 2)
        errs.username = "Username must be at least 2 characters";
      if (!email || !emailRegex.test(email))
        errs.email = "Enter a valid email address";
      if (!password || password.length < 6)
        errs.password = "Password must be at least 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    if (mode === "phone") {
      /**
       * POST /api/send-phone-otp
       * Body: { phoneNumber: "+91XXXXXXXXXX" }
       */
      const result = await dispatch(
        sendPhoneOTP({
          phoneNumber: phone.full,
          password: phonePassword, // ✅ ADD THIS
        })
      );
      if (sendPhoneOTP.fulfilled.match(result)) {
        navigate("/auth/otp", {
          state: { type: "phone", identifier: phone.full },
        });
      } else {
        setErrors({ phone: result.payload?.message || "Failed to send OTP" });
      }
    } else {
      /**
       * POST /api/send-email-otp
       * Body: { email, username, password }
       * Backend saves pending user & sends OTP.
       * username + password are forwarded to the OTP page so
       * verifyEmailOTP({ email, otp, username, password }) can
       * complete registration after the code is confirmed.
       */
      const result = await dispatch(sendEmailOTP({ email, username, password }));
      if (sendEmailOTP.fulfilled.match(result)) {
        navigate("/auth/otp", {
          state: { type: "email", identifier: email, username, password },
        });
      } else {
        setErrors({ email: result.payload?.message || "Failed to send OTP" });
      }
    }
  };

  const handleSocial = async (provider) => {
    setSocialLoading(provider);
    try {
      console.log("Social signup:", provider);
      // TODO: dispatch(loginUser({ provider })) then handle token/navigate
    } finally {
      setSocialLoading(null);
    }
  };

  const switchMode = (tab) => { setMode(tab); setErrors({}); };

  return (
    <AuthLayout>

      {/* Header */}
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#5F9598" }}>
          Begin Your Journey
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "#061E29" }}>
          {mode === "phone" ? "Create Account" : "Sign up with Email"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5F9598" }}>
          {mode === "phone"
            ? "Enter your phone number to get started"
            : "Fill in your details to create your account"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl p-1 mb-6" style={{ background: "#F3F4F4" }}>
        {[{ key: "phone", label: "Phone" }, { key: "email", label: "Email" }].map(({ key, label }) => (
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

      {/* ─────────────────────────────────────────
          PHONE TAB
          Fields  : Phone number
          Action  : POST /api/send-phone-otp → /auth/otp
         ───────────────────────────────────────── */}
      {mode === "phone" && (
        <div className="space-y-4">

          {/* Phone */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "#061E29" }}
            >
              Phone Number <span className="text-red-400">*</span>
            </label>

            <PhoneInput
              key="phone-input"   // ✅ prevents UI bug
              value={phone}
              onChange={(full, raw) => setPhone({ full, raw })}
              error={errors.phone}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "#061E29" }}
            >
              Password <span className="text-red-400">*</span>
            </label>

            <FormInput
              type="password"
              placeholder="Min. 6 characters"
              value={phonePassword}
              onChange={(e) => setPhonePassword(e.target.value)}
              error={errors.phonePassword}
              required
              autoComplete="new-password"
            />
          </div>

          <PrimaryBtn onClick={handleContinue} disabled={loading}>
            {loading ? (
              <>
                <Spinner /> Sending OTP…
              </>
            ) : (
              "Continue"
            )}
          </PrimaryBtn>

          <Divider />

          <div className="grid grid-cols-2 gap-3">
            <SocialButton
              provider="google"
              onClick={() => handleSocial("google")}
              loading={socialLoading === "google"}
            />
            <SocialButton
              provider="apple"
              onClick={() => handleSocial("apple")}
              loading={socialLoading === "apple"}
            />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          EMAIL TAB
          Fields  : Username · Email · Password
          Action  : POST /api/send-email-otp → /auth/otp
         ───────────────────────────────────────── */}
      {mode === "email" && (
        <div className="space-y-4">

          <FormInput
            label="Username"
            type="text"
            placeholder="e.g. sterling_archer"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            required
            autoComplete="username"
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            autoComplete="new-password"
          />

          <p className="text-xs" style={{ color: "#5F9598" }}>
            By continuing, you agree to our{" "}
            <a href="/terms" style={{ color: "#1D546D" }} className="hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" style={{ color: "#1D546D" }} className="hover:underline">Privacy Policy</a>.
          </p>

          <PrimaryBtn onClick={handleContinue} disabled={loading}>
            {loading ? <><Spinner /> Sending OTP…</> : "Create Account"}
          </PrimaryBtn>

        </div>
      )}

      <p className="mt-6 text-center text-sm" style={{ color: "#5F9598" }}>
        Already have an account?{" "}
        <a href="/auth/login" style={{ color: "#1D546D" }} className="font-semibold hover:underline">Log in</a>
      </p>

    </AuthLayout>
  );
}