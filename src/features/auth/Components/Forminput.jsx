/**
 * FormInput.jsx
 * A clean, styled text / email / password input.
 * Has ZERO connection to PhoneInput — renders a plain <input>.
 */
import { useState } from "react";

export default function FormInput({
  label,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  error,
  required = false,
  autoComplete,
  disabled = false,
}) {
  const [showPwd, setShowPwd] = useState(false);
  const resolvedType = type === "password" ? (showPwd ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#061E29" }}>
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      <div
        className="flex items-center rounded-xl overflow-hidden transition-all duration-200"
        style={{
          border:     error ? "1px solid #ef4444" : "1px solid #d1d5db",
          boxShadow:  error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
          background: disabled ? "#f9fafb" : "#ffffff",
        }}
      >
        <input
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="flex-1 px-3.5 py-3.5 text-sm outline-none bg-transparent w-full"
          style={{ color: "#061E29", caretColor: "#1D546D" }}
        />

        {/* Show / hide toggle for password */}
        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd((v) => !v)}
            className="px-3 flex-shrink-0 transition-colors"
            style={{ color: "#5F9598" }}
            aria-label={showPwd ? "Hide password" : "Show password"}
          >
            {showPwd ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                     a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878
                     l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59
                     m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025
                     0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542
                     7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}