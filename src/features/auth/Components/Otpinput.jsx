import { useRef, useState } from "react";

export default function OtpInput({ length = 6, onChange }) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputs = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = val;
    setValues(next);
    onChange?.(next.join(""));
    if (val && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !values[index] && index > 0)
      inputs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = Array(length).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setValues(next);
    onChange?.(next.join(""));
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold rounded-xl outline-none transition-all duration-200"
          style={{
            border: v ? "2px solid #1D546D" : "1.5px solid #d1d5db",
            background: v ? "#F3F4F4" : "#ffffff",
            color: v ? "#061E29" : "#1D546D",
            boxShadow: v ? "0 0 0 3px rgba(29,84,109,0.1)" : "none",
          }}
        />
      ))}
    </div>
  );
}