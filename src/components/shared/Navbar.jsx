// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../features/auth/auth.slice";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Shop by Category", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "Careers", href: "/careers" },
  { label: "Services", href: "/services" },
  { label: "Support", href: "/support" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [activeLink, setActiveLink] = useState("New Arrivals");
  const [location, setLocation] = useState("Add your location");
  const [locationSet, setLocationSet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const drawerRef = useRef(null);

  const user = useSelector((s) => s.auth?.user);
  const userName = user?.displayName || user?.name || "Guest";
  const isLoggedIn = !!user;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) dispatch(fetchUser());
  }, [dispatch]);

  // Close drawer on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  // Lock body scroll when drawer open
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
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "Unknown";
          const country = data.address.country || "";
          setLocation(`${city}, ${country}`);
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
      <header className="fixed top-0 z-50 w-full bg-white dark:bg-[#061E29] border-b border-gray-100 dark:border-[#1D546D]/30 shadow-sm">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-14 sm:h-16 max-w-[1920px] mx-auto gap-3">

          {/* Mobile: Burger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D546D]/20 transition-colors text-gray-600 dark:text-gray-300 shrink-0"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <i className="fa-solid fa-bars text-[18px]" />
          </button>

          {/* Brand */}
          <Link
            to="/"
            className="text-xl font-black text-[#061E29] dark:text-white tracking-tight shrink-0"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Tijaraa
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-[700px] mx-6"
          >
            <div className="flex items-center gap-3 px-4 py-2.5 w-full border border-gray-200 dark:border-[#1D546D]/60 rounded-xl bg-gray-50 dark:bg-[#0d2f3f] hover:border-[#30647E] focus-within:border-[#30647E] focus-within:ring-2 focus-within:ring-[#30647E]/10 transition-all">
              <i className="fa-solid fa-magnifying-glass text-gray-400 text-[18px]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for luxury goods, property, or careers..."
                className="w-full bg-transparent text-[13px] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none border-none focus:ring-0"
                style={{ fontFamily: "Manrope, sans-serif" }}
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Mobile: Search toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D546D]/20 transition-colors text-gray-600 dark:text-gray-300"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass text-[18px]" />
            </button>

            {/* Desktop: Location */}
            <div
              onClick={handleLocation}
              className="hidden lg:flex items-center gap-1.5 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-[#30647E] dark:hover:text-[#5a9ab8] transition-colors whitespace-nowrap shrink-0 mr-2"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              <i className="fa-solid fa-location-dot text-[14px]" />
              <span className="text-[13px] font-medium max-w-[140px] truncate">{location}</span>
            </div>

            {/* Cart — always visible */}
            <button
              onClick={() => navigate("/cart")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D546D]/20 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Cart"
            >
              <i className="fa-solid fa-cart-shopping text-[18px]" />
            </button>

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D546D]/20 transition-colors text-gray-600 dark:text-gray-300"
                  aria-label="Profile"
                >
                  <i className="fa-solid fa-user text-[18px]" />
                  <span className="hidden xl:block text-[12px] text-gray-500 dark:text-gray-400" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Hey, <span className="font-bold text-gray-700 dark:text-gray-200">{userName}</span>
                  </span>
                </button>
                <button
                  onClick={() => navigate("/sell")}
                  className="hidden sm:block px-3.5 py-1.5 text-[12.5px] font-semibold text-[#30647E] border border-[#30647E] rounded-lg hover:bg-[#30647E] hover:text-white transition-colors"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  + Sell
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="hidden sm:block px-3.5 py-1.5 text-[12.5px] font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#1D546D]/60 rounded-lg hover:border-[#30647E] hover:text-[#30647E] transition-colors"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="hidden sm:block px-3.5 py-1.5 text-[12.5px] font-semibold bg-[#061E29] dark:bg-[#30647E] text-white rounded-lg hover:bg-[#30647E] dark:hover:bg-[#1D546D] transition-colors"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile Search Dropdown ── */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 pb-3 bg-white dark:bg-[#061E29]">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-[#1D546D]/60 rounded-xl bg-gray-50 dark:bg-[#0d2f3f] focus-within:border-[#30647E] focus-within:ring-2 focus-within:ring-[#30647E]/10 transition-all">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-[16px]" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for luxury goods, property..."
                  className="w-full bg-transparent text-[13px] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none border-none focus:ring-0"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                    <i className="fa-solid fa-xmark text-[14px]" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── Desktop Secondary Nav ── */}
        <nav className="hidden lg:block border-t border-gray-100 dark:border-[#1D546D]/20 bg-white dark:bg-[#061E29] px-6 lg:px-10">
          <div className="flex justify-center">
            <div className="flex items-center gap-10 max-w-[1200px] overflow-x-auto scrollbar-hide">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeLink === label;
                return (
                  <Link
                    key={label}
                    to={href}
                    onClick={() => handleNavClick(label)}
                    className={`relative px-2 py-3 text-[13px] font-semibold whitespace-nowrap transition-colors ${isActive
                      ? "text-[#30647E]"
                      : "text-gray-500 dark:text-gray-400 hover:text-[#30647E] dark:hover:text-[#5a9ab8]"
                      }`}
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#30647E] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer Overlay ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw] bg-white dark:bg-[#061E29] shadow-2xl flex flex-col overflow-y-auto"
            style={{ animation: "slideIn 0.22s ease" }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100 dark:border-[#1D546D]/30 shrink-0">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-black text-[#061E29] dark:text-white tracking-tight"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Tijaraa
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D546D]/20 text-gray-500 dark:text-gray-400"
                aria-label="Close menu"
              >
                <i className="fa-solid fa-xmark text-[18px]" />
              </button>
            </div>

            {/* User greeting / Auth buttons */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1D546D]/20">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#30647E]/10 flex items-center justify-center">
                    <i className="fa-solid fa-user text-[#30647E] text-[16px]" />
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400" style={{ fontFamily: "Manrope, sans-serif" }}>Welcome back,</p>
                    <p className="text-[14px] font-bold text-gray-800 dark:text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{userName}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { navigate("/auth/login"); setMenuOpen(false); }}
                    className="flex-1 py-2 text-[13px] font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#1D546D]/60 rounded-lg hover:border-[#30647E] hover:text-[#30647E] transition-colors"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate("/auth/signup"); setMenuOpen(false); }}
                    className="flex-1 py-2 text-[13px] font-semibold bg-[#061E29] dark:bg-[#30647E] text-white rounded-lg hover:bg-[#30647E] transition-colors"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Location */}
            <div
              onClick={handleLocation}
              className="flex items-center gap-2 px-5 py-3 cursor-pointer border-b border-gray-100 dark:border-[#1D546D]/20 hover:bg-gray-50 dark:hover:bg-[#1D546D]/10 transition-colors"
            >
              <i className="fa-solid fa-location-dot text-[#30647E] text-[14px]" />
              <span className="text-[13px] text-gray-600 dark:text-gray-300 font-medium truncate" style={{ fontFamily: "Manrope, sans-serif" }}>
                {location}
              </span>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col py-2 flex-1">
              <p className="px-5 pt-2 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "Manrope, sans-serif" }}>
                Browse
              </p>
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeLink === label;
                return (
                  <Link
                    key={label}
                    to={href}
                    onClick={() => handleNavClick(label)}
                    className={`flex items-center gap-3 px-5 py-3 text-[14px] font-semibold transition-colors ${isActive
                      ? "text-[#30647E] bg-[#30647E]/5"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#30647E] hover:bg-gray-50 dark:hover:bg-[#1D546D]/10"
                      }`}
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {isActive && <span className="w-[3px] h-5 bg-[#30647E] rounded-full shrink-0 -ml-1" />}
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer Actions */}
            {isLoggedIn && (
              <div className="px-5 py-4 border-t border-gray-100 dark:border-[#1D546D]/20 space-y-2 shrink-0">
                <button
                  onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#1D546D]/60 rounded-lg hover:border-[#30647E] transition-colors"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  <i className="fa-solid fa-user text-[14px] text-gray-400" />
                  My Profile
                </button>
                <button
                  onClick={() => { navigate("/sell"); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-[#30647E] border border-[#30647E] rounded-lg hover:bg-[#30647E] hover:text-white transition-colors"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  <i className="fa-solid fa-plus text-[14px]" />
                  Sell on Tijaraa
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drawer slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}