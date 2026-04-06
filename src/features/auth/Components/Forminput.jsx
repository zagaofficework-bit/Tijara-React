import { useState } from "react";

/**
 * FormInput
 * A plain, styled text/email/password input.
 * Has ZERO dependency on PhoneInput — it never renders a country selector.
 *
 * Props:
 *  label       – visible label string (optional)
 *  type        – "text" | "email" | "password"  (default: "text")
 *  placeholder – placeholder string
 *  value       – controlled value
 *  onChange    – change handler  (e) => void
 *  error       – error message string
 *  required    – shows red asterisk when true
 *  autoComplete– native autocomplete hint
 */
export default function FormInput({
  label,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  error,
  required = false,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Resolve the actual input type (toggle for password)
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#061E29" }}
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className="flex items-center rounded-xl overflow-hidden transition-all duration-200"
        style={{
          border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
          boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
          background: "#ffffff",
        }}
      >
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="flex-1 px-3 py-3.5 text-sm outline-none bg-transparent"
          style={{ color: "#061E29" }}
        />

        {/* Show/hide toggle for password fields */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="px-3 flex-shrink-0"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye-off icon
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: "#5F9598" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              // Eye icon
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: "#5F9598" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}