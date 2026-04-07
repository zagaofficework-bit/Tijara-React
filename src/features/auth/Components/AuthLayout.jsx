export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F3F4F4" }}>
      <div
        className="w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex min-h-[580px]"
        style={{ background: "#ffffff" }}
      >
        {/* Left branding panel */}
        <div
          className="hidden md:flex flex-col justify-between w-2/5 p-10 relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #061E29 0%, #1D546D 60%, #5F9598 100%)" }}
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full" style={{ background: "rgba(95,149,152,0.12)" }} />
          <div className="absolute bottom-10 -right-20 w-72 h-72 rounded-full" style={{ background: "rgba(95,149,152,0.10)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#5F9598" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg tracking-wide">eClassify</span>
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-white text-3xl font-bold leading-tight mb-4">
              The art of<br />
              <span style={{ color: "#5F9598" }}>acquisition.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Join an elite circle of collectors and enthusiasts. Experience a marketplace redefined by quiet authority.
            </p>
          </div>

          <div className="relative z-10 flex gap-4">
            {[["50K+", "Listings"], ["12K+", "Members"], ["4.9★", "Rating"]].map(([val, label], i) => (
              <div key={label} className="flex items-center gap-4">
                {i > 0 && <div className="w-px h-8" style={{ background: "rgba(95,149,152,0.4)" }} />}
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{val}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-10 overflow-y-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}