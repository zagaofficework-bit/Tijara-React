import { useState, useRef, useEffect } from "react";

const COUNTRIES = [
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
];

export default function PhoneInput({ value, onChange, error }) {
  const [selected, setSelected] = useState(COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropRef = useRef(null);

  /* Filter countries */
  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Handle number input */
  const handleNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    onChange?.(selected.dial + raw, raw);
  };

  /* Handle country change */
  const handleSelect = (c) => {
    setSelected(c);
    setOpen(false);
    setSearch("");

    // ✅ Reset number when country changes
    onChange?.(c.dial, "");
  };

  return (
    <div className="relative" ref={dropRef}>
      <div
        className={`flex items-center bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
          error
            ? "border-red-400 ring-1 ring-red-300"
            : "border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-200"
        }`}
      >
        {/* Country selector */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-3.5 bg-slate-50 border-r border-slate-200 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700 min-w-[80px]"
        >
          <span className="text-base">{selected.flag}</span>
          <span className="text-slate-500">{selected.dial}</span>
          <svg
            className={`w-3 h-3 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Phone input */}
        <input
          type="tel"
          placeholder="Enter phone number"
          value={value?.raw || ""}   // ✅ Controlled input
          onChange={handleNumber}
          className="flex-1 px-3 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal-400"
              autoFocus
            />
          </div>

          <ul className="max-h-48 overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(c)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors ${
                    selected.code === c.code
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "text-slate-700"
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-left">{c.name}</span>
                  <span className="text-slate-400">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}