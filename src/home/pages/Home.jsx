// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../features/auth/services/auth.slice"

const NAV_LINKS = [
  { label: "New Arrivals",     href: "/new-arrivals" },
  { label: "Shop by Category", href: "/categories" },
  { label: "Deals",            href: "/deals" },
  { label: "Careers",          href: "/careers" },
  { label: "Services",         href: "/services" },
  { label: "Support",          href: "/support" },
];

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
    const handleOutside = (e) => {
      if (menuOpen && drawerRef.current && !drawerRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
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

  /* ─── shared inline-style helpers ─── */
  const iconBtn = {
    color: "#5F9598",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: 10,
    padding: "6px 8px",
    transition: "background 0.15s",
    fontFamily: "Manrope, sans-serif",
  };

  return (
    <>
      {/* ════════════════════════════ HEADER ════════════════════════════ */}
      <header
        className="fixed top-0 z-50 w-full"
        style={{
          background: "#061E29",
          borderBottom: "1px solid #1D546D30",
          boxShadow: "0 2px 16px rgba(6,30,41,0.4)",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        {/* Gradient accent stripe */}
        <div
          className="h-[2px] w-full"
          style={{ background: "linear-gradient(90deg, #061E29, #1D546D 30%, #5F9598 60%, #1D546D 85%, #061E29)" }}
        />

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-14 sm:h-16 max-w-[1920px] mx-auto gap-3">

          {/* Mobile burger */}
          <button
            style={{ ...iconBtn }}
            className="lg:hidden shrink-0"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D25"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <i className="fa-solid fa-bars text-[18px]" />
          </button>

          {/* ── Brand ── */}
          <Link to="/" className="shrink-0 flex items-center gap-2 group" style={{ textDecoration: "none" }}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #1D546D, #0F3D52)", border: "1px solid #5F959830" }}
            >
              <i className="fa-solid fa-bolt text-[12px]" style={{ color: "#5F9598" }} />
            </div>
            <span
              className="text-[18px] font-black tracking-tight"
              style={{ color: "white", letterSpacing: "-0.03em" }}
            >
              Quick<span style={{ color: "#5F9598" }}>Hive</span>
            </span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-[680px] mx-6">
            <div
              className="flex items-center gap-2.5 px-4 py-2.5 w-full rounded-xl transition-all"
              style={{ background: "#0F3D52", border: "1px solid #1D546D50" }}
              onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#5F9598"; e.currentTarget.style.boxShadow = "0 0 0 3px #5F959815"; }}
              onBlurCapture={(e)  => { e.currentTarget.style.borderColor = "#1D546D50"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <i className="fa-solid fa-magnifying-glass text-[14px] shrink-0" style={{ color: "#5F9598" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings, property, careers..."
                className="w-full bg-transparent text-[13px] outline-none border-none"
                style={{ color: "white", fontFamily: "Manrope, sans-serif" }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{ color: "#5F959870", background: "none", border: "none", cursor: "pointer" }}
                >
                  <i className="fa-solid fa-xmark text-[13px]" />
                </button>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">

            {/* Mobile: search toggle */}
            <button
              style={iconBtn}
              className="lg:hidden"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Search"
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D25"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <i className="fa-solid fa-magnifying-glass text-[17px]" />
            </button>

            {/* Desktop: location */}
            <div
              onClick={handleLocation}
              className="hidden lg:flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 mr-1 px-2.5 py-1.5 rounded-lg transition-all"
              style={{ color: "#5F959880", fontFamily: "Manrope, sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#5F9598"; e.currentTarget.style.background = "#1D546D20"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#5F959880"; e.currentTarget.style.background = "transparent"; }}
            >
              <i className="fa-solid fa-location-dot text-[12px]" />
              <span className="text-[12px] font-semibold max-w-[130px] truncate">{location}</span>
            </div>

            {/* Cart */}
            <button
              style={iconBtn}
              onClick={() => navigate("/cart")}
              aria-label="Cart"
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D25"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <i className="fa-solid fa-cart-shopping text-[17px]" />
            </button>

            {isLoggedIn ? (
              <>
                {/* Profile */}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all"
                  style={{ color: "#5F9598", background: "transparent", border: "none", cursor: "pointer", fontFamily: "Manrope, sans-serif" }}
                  aria-label="Profile"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D20"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                    style={{ background: "#1D546D", color: "#5F9598", border: "1px solid #5F959840" }}
                  >
                    {userName[0]?.toUpperCase()}
                  </div>
                  <span className="hidden xl:block text-[12px] font-semibold" style={{ color: "#5F959890" }}>
                    Hey,{" "}
                    <span className="font-black" style={{ color: "white" }}>{userName}</span>
                  </span>
                </button>

                {/* Sell */}
                <button
                  onClick={() => navigate("/sell")}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl font-black text-[12px] transition-all hover:brightness-110 active:scale-95"
                  style={{ background: "#1D546D", color: "white", border: "none", cursor: "pointer", padding: "7px 14px", fontFamily: "Manrope, sans-serif" }}
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  Sell
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="hidden sm:block rounded-xl font-black text-[12px] transition-all"
                  style={{
                    color: "#5F9598",
                    border: "1px solid #1D546D60",
                    background: "transparent",
                    cursor: "pointer",
                    padding: "7px 14px",
                    fontFamily: "Manrope, sans-serif",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D20"; e.currentTarget.style.borderColor = "#5F9598"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#1D546D60"; }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="hidden sm:block rounded-xl font-black text-[12px] transition-all hover:brightness-110 active:scale-95"
                  style={{ background: "#1D546D", color: "white", border: "none", cursor: "pointer", padding: "7px 14px", fontFamily: "Manrope, sans-serif" }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile Search Dropdown ── */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 pb-3" style={{ background: "#061E29" }}>
            <form onSubmit={handleSearch}>
              <div
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all"
                style={{ background: "#0F3D52", border: "1px solid #1D546D50" }}
              >
                <i className="fa-solid fa-magnifying-glass text-[14px] shrink-0" style={{ color: "#5F9598" }} />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search listings, property, careers..."
                  className="w-full bg-transparent text-[13px] outline-none border-none"
                  style={{ color: "white", fontFamily: "Manrope, sans-serif" }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    style={{ color: "#5F959870", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <i className="fa-solid fa-xmark text-[13px]" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── Desktop Secondary Nav ── */}
        <nav
          className="hidden lg:block px-6 lg:px-10"
          style={{ borderTop: "1px solid #1D546D22", background: "#061E29" }}
        >
          <div className="flex justify-center">
            <div className="flex items-center gap-0.5 max-w-[1200px] overflow-x-auto scrollbar-hide">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeLink === label;
                return (
                  <Link
                    key={label}
                    to={href}
                    onClick={() => handleNavClick(label)}
                    className="relative px-3.5 py-3 text-[12.5px] font-bold whitespace-nowrap transition-colors"
                    style={{
                      color: isActive ? "#5F9598" : "#5F959858",
                      textDecoration: "none",
                      fontFamily: "Manrope, sans-serif",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#5F9598"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#5F959858"; }}
                  >
                    {label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background: "#5F9598" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════ MOBILE DRAWER ══════════════════════════ */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(6,30,41,0.75)", backdropFilter: "blur(4px)" }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw] flex flex-col overflow-y-auto"
            style={{
              background: "#061E29",
              borderRight: "1px solid #1D546D35",
              animation: "slideIn 0.22s ease",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            {/* Accent stripe */}
            <div className="h-[2px] w-full shrink-0" style={{ background: "linear-gradient(90deg, #1D546D, #5F9598)" }} />

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 h-14 shrink-0"
              style={{ borderBottom: "1px solid #1D546D25" }}
            >
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "#1D546D", border: "1px solid #5F959830" }}
                >
                  <i className="fa-solid fa-bolt text-[11px]" style={{ color: "#5F9598" }} />
                </div>
                <span className="text-[16px] font-black" style={{ color: "white", letterSpacing: "-0.03em" }}>
                  Quick<span style={{ color: "#5F9598" }}>Hive</span>
                </span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "#5F9598", background: "transparent", border: "none", cursor: "pointer" }}
                aria-label="Close menu"
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D25"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <i className="fa-solid fa-xmark text-[18px]" />
              </button>
            </div>

            {/* Auth / user block */}
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #1D546D20" }}>
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-black shrink-0"
                    style={{ background: "#1D546D", color: "#5F9598", border: "1px solid #5F959840" }}
                  >
                    {userName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: "#5F959860" }}>Welcome back,</p>
                    <p className="text-[14px] font-black" style={{ color: "white" }}>{userName}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { navigate("/auth/login"); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl font-black text-[13px] transition-all"
                    style={{ color: "#5F9598", border: "1px solid #1D546D55", background: "transparent", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D20"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate("/auth/signup"); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl font-black text-[13px] transition-all hover:brightness-110"
                    style={{ background: "#1D546D", color: "white", border: "none", cursor: "pointer" }}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Location */}
            <div
              onClick={handleLocation}
              className="flex items-center gap-2.5 px-5 py-3.5 cursor-pointer transition-colors"
              style={{ borderBottom: "1px solid #1D546D20" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D12"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <i className="fa-solid fa-location-dot text-[13px]" style={{ color: "#5F9598" }} />
              <span className="text-[13px] font-semibold truncate" style={{ color: "#5F959885" }}>
                {location}
              </span>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col py-2 flex-1">
              <p className="px-5 pt-3 pb-1.5 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: "#5F959845" }}>
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
                    style={{
                      color: isActive ? "#5F9598" : "#5F959868",
                      background: isActive ? "#1D546D18" : "transparent",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "#5F9598"; e.currentTarget.style.background = "#1D546D10"; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "#5F959868"; e.currentTarget.style.background = "transparent"; } }}
                  >
                    {isActive && (
                      <span className="w-[3px] h-4 rounded-full shrink-0 -ml-1" style={{ background: "#5F9598" }} />
                    )}
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Logged-in footer actions */}
            {isLoggedIn && (
              <div className="px-5 py-4 space-y-2 shrink-0" style={{ borderTop: "1px solid #1D546D20" }}>
                <button
                  onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all"
                  style={{ color: "#5F9598", border: "1px solid #1D546D40", background: "transparent", cursor: "pointer", fontFamily: "Manrope, sans-serif" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1D546D15"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <i className="fa-solid fa-user text-[13px]" style={{ color: "#5F959860" }} />
                  My Profile
                </button>
                <button
                  onClick={() => { navigate("/sell"); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-[13px] transition-all hover:brightness-110"
                  style={{ background: "#1D546D", color: "white", border: "none", cursor: "pointer", fontFamily: "Manrope, sans-serif" }}
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