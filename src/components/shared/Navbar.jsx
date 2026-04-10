// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../features/auth/services/auth.slice";

// ─────────────────────────────────────────────────────────────────
// COLOUR TOKENS  (light ecom theme)
//   --brand      : #1D546D   (deep teal — buttons, active, links)
//   --brand-light: #EBF4F7   (tinted surface for hover / chips)
//   --brand-mid  : #5F9598   (secondary accent, icons)
//   --surface    : #FFFFFF   (header bg)
//   --surface-2  : #F7F9FA   (subnav / drawer bg)
//   --border     : #E4EAED   (dividers)
//   --text-hi    : #0E1E25   (headings, primary text)
//   --text-lo    : #6B8898   (muted labels)
// ─────────────────────────────────────────────────────────────────

const C = {
  brand:      "#1D546D",
  brandLight: "#EBF4F7",
  brandMid:   "#5F9598",
  surface:    "#FFFFFF",
  surface2:   "#F7F9FA",
  border:     "#E4EAED",
  textHi:     "#0E1E25",
  textLo:     "#6B8898",
};

const NAV_LINKS = [
  { label: "New Arrivals",     href: "/new-arrivals" },
  { label: "Shop by Category", href: "/categories" },
  { label: "Deals",            href: "/deals" },
  { label: "Careers",          href: "/careers" },
  { label: "Services",         href: "/services" },
  { label: "Support",          href: "/support" },
];

const FF = "Manrope, sans-serif";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search,           setSearch]           = useState("");
  const [activeLink,       setActiveLink]       = useState("New Arrivals");
  const [location,         setLocation]         = useState("Add your location");
  const [locationSet,      setLocationSet]      = useState(false);
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const drawerRef = useRef(null);

  const user       = useSelector((s) => s.auth?.user);
  const userName   = user?.displayName || user?.name || "Guest";
  const isLoggedIn = !!user;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    const fn = (e) => {
      if (menuOpen && drawerRef.current && !drawerRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setMobileSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const handleLocation = () => {
    if (locationSet) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown";
          setLocation(`${city}, ${data.address.country || ""}`);
        } catch {
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
        setLocationSet(true);
      },
      () => setLocation("Location unavailable")
    );
  };

  const handleNavClick = (label) => {
    setActiveLink(label);
    setMenuOpen(false);
  };

  return (
    <>
      {/* ════════════════════════ HEADER ════════════════════════ */}
      <header
        className="fixed top-0 z-50 w-full"
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          fontFamily: FF,
        }}
      >
        {/* ── Top bar ── */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-14 sm:h-[60px] max-w-[1440px] mx-auto gap-3"
        >
          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors shrink-0"
            style={{ color: C.textHi }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <i className="fa-solid fa-bars text-[18px]" />
          </button>

          {/* Brand */}
          <Link to="/" className="shrink-0 flex items-center gap-2 group" style={{ textDecoration: "none" }}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ background: C.brand }}
            >
              <i className="fa-solid fa-bolt text-[13px] text-white" />
            </div>
            <span
              className="text-[18px] font-black tracking-tight"
              style={{ color: C.textHi, letterSpacing: "-0.03em" }}
            >
              Quick<span style={{ color: C.brand }}>Hive</span>
            </span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-[600px] mx-6">
            <div
              className="flex items-center gap-2.5 px-4 py-2.5 w-full rounded-xl transition-all"
              style={{ background: C.surface2, border: `1.5px solid ${C.border}` }}
              onFocusCapture={(e) => { e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.brandLight}`; }}
              onBlurCapture={(e)  => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
            >
              <i className="fa-solid fa-magnifying-glass text-[14px] shrink-0" style={{ color: C.textLo }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings, property, careers..."
                className="w-full bg-transparent text-[13px] outline-none border-none"
                style={{ color: C.textHi, fontFamily: FF }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{ color: C.textLo, background: "none", border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.textHi; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.textLo; }}
                >
                  <i className="fa-solid fa-xmark text-[13px]" />
                </button>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-0.5 shrink-0">

            {/* Mobile search toggle */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: C.textHi, background: "transparent", border: "none", cursor: "pointer" }}
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Search"
              onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <i className="fa-solid fa-magnifying-glass text-[17px]" />
            </button>

            {/* Desktop location */}
            <button
              onClick={handleLocation}
              className="hidden lg:flex items-center gap-1.5 whitespace-nowrap shrink-0 mr-1 px-2.5 py-1.5 rounded-lg transition-all text-left"
              style={{ color: C.textLo, background: "transparent", border: "none", cursor: "pointer", fontFamily: FF }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.brand; e.currentTarget.style.background = C.brandLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textLo; e.currentTarget.style.background = "transparent"; }}
            >
              <i className="fa-solid fa-location-dot text-[12px]" />
              <span className="text-[12px] font-semibold max-w-[120px] truncate">{location}</span>
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="p-2 rounded-lg transition-colors"
              style={{ color: C.textHi, background: "transparent", border: "none", cursor: "pointer" }}
              aria-label="Cart"
              onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; e.currentTarget.style.color = C.brand; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textHi; }}
            >
              <i className="fa-solid fa-cart-shopping text-[17px]" />
            </button>

            {isLoggedIn ? (
              <>
                {/* Profile */}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all"
                  style={{ color: C.textHi, background: "transparent", border: "none", cursor: "pointer", fontFamily: FF }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 text-white"
                    style={{ background: C.brand }}
                  >
                    {userName[0]?.toUpperCase()}
                  </div>
                  <span className="hidden xl:block text-[12px] font-semibold" style={{ color: C.textLo }}>
                    Hey,{" "}
                    <span className="font-black" style={{ color: C.textHi }}>{userName}</span>
                  </span>
                </button>

                {/* Sell */}
                <button
                  onClick={() => navigate("/sell")}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl font-black text-[12px] transition-all hover:opacity-90 active:scale-95 text-white ml-1"
                  style={{ background: C.brand, border: "none", cursor: "pointer", padding: "8px 14px", fontFamily: FF }}
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  Sell
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="hidden sm:block rounded-xl font-black text-[12px] transition-all ml-1"
                  style={{ color: C.brand, border: `1.5px solid ${C.brand}`, background: "transparent", cursor: "pointer", padding: "7px 14px", fontFamily: FF }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="hidden sm:block rounded-xl font-black text-[12px] transition-all hover:opacity-90 active:scale-95 text-white ml-1"
                  style={{ background: C.brand, border: "none", cursor: "pointer", padding: "8px 14px", fontFamily: FF }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile search dropdown ── */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 pb-3" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
            <form onSubmit={handleSearch}>
              <div
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all"
                style={{ background: C.surface2, border: `1.5px solid ${C.border}` }}
              >
                <i className="fa-solid fa-magnifying-glass text-[14px] shrink-0" style={{ color: C.textLo }} />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search listings, property, careers..."
                  className="w-full bg-transparent text-[13px] outline-none border-none"
                  style={{ color: C.textHi, fontFamily: FF }}
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} style={{ color: C.textLo, background: "none", border: "none", cursor: "pointer" }}>
                    <i className="fa-solid fa-xmark text-[13px]" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── Desktop subnav ── */}
        <nav
          className="hidden lg:block px-6 lg:px-10"
          style={{ background: C.surface2, borderTop: `1px solid ${C.border}` }}
        >
          <div className="flex justify-center max-w-[1440px] mx-auto">
            <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeLink === label;
                return (
                  <Link
                    key={label}
                    to={href}
                    onClick={() => handleNavClick(label)}
                    className="relative px-3.5 py-3 text-[12.5px] font-bold whitespace-nowrap transition-colors"
                    style={{
                      color: isActive ? C.brand : C.textLo,
                      textDecoration: "none",
                      fontFamily: FF,
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = C.brand; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = C.textLo; }}
                  >
                    {label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background: C.brand }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* ════════════════════════ MOBILE DRAWER ════════════════════════ */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(14,30,37,0.45)", backdropFilter: "blur(3px)" }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            ref={drawerRef}
            className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw] flex flex-col overflow-y-auto"
            style={{ background: C.surface, borderRight: `1px solid ${C.border}`, animation: "slideIn 0.22s ease", fontFamily: FF }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-14 shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
              <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2" style={{ textDecoration: "none" }}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.brand }}>
                  <i className="fa-solid fa-bolt text-[11px] text-white" />
                </div>
                <span className="text-[16px] font-black" style={{ color: C.textHi, letterSpacing: "-0.03em" }}>
                  Quick<span style={{ color: C.brand }}>Hive</span>
                </span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: C.textLo, background: "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; e.currentTarget.style.color = C.textHi; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textLo; }}
              >
                <i className="fa-solid fa-xmark text-[18px]" />
              </button>
            </div>

            {/* Auth block */}
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-black shrink-0 text-white" style={{ background: C.brand }}>
                    {userName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: C.textLo }}>Welcome back,</p>
                    <p className="text-[14px] font-black" style={{ color: C.textHi }}>{userName}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { navigate("/auth/login"); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl font-black text-[13px] transition-all"
                    style={{ color: C.brand, border: `1.5px solid ${C.brand}`, background: "transparent", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate("/auth/signup"); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl font-black text-[13px] text-white transition-all hover:opacity-90"
                    style={{ background: C.brand, border: "none", cursor: "pointer" }}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Location */}
            <button
              onClick={handleLocation}
              className="flex items-center gap-2.5 px-5 py-3.5 w-full text-left transition-colors"
              style={{ borderBottom: `1px solid ${C.border}`, color: C.textLo, background: "transparent", border: "none", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; e.currentTarget.style.color = C.brand; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textLo; }}
            >
              <i className="fa-solid fa-location-dot text-[13px]" />
              <span className="text-[13px] font-semibold truncate">{location}</span>
            </button>

            {/* Nav links */}
            <nav className="flex flex-col py-2 flex-1">
              <p className="px-5 pt-3 pb-1.5 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: C.textLo }}>
                Browse
              </p>
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeLink === label;
                return (
                  <Link
                    key={label}
                    to={href}
                    onClick={() => handleNavClick(label)}
                    className="flex items-center gap-3 px-5 py-3 text-[13px] font-bold transition-colors"
                    style={{ color: isActive ? C.brand : C.textHi, background: isActive ? C.brandLight : "transparent", textDecoration: "none" }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = C.brandLight; e.currentTarget.style.color = C.brand; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textHi; } }}
                  >
                    {isActive && <span className="w-[3px] h-4 rounded-full shrink-0 -ml-1" style={{ background: C.brand }} />}
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer actions */}
            {isLoggedIn && (
              <div className="px-5 py-4 space-y-2 shrink-0" style={{ borderTop: `1px solid ${C.border}` }}>
                <button
                  onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all"
                  style={{ color: C.textHi, border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", fontFamily: FF }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.brandLight; e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.color = C.brand; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textHi; }}
                >
                  <i className="fa-solid fa-user text-[13px]" style={{ color: C.textLo }} />
                  My Profile
                </button>
                <button
                  onClick={() => { navigate("/sell"); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-[13px] text-white transition-all hover:opacity-90"
                  style={{ background: C.brand, border: "none", cursor: "pointer", fontFamily: FF }}
                >
                  <i className="fa-solid fa-plus text-[11px]" />
                  Sell on QuickHive
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}