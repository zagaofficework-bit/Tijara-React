// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Deals",        href: "/deals" },
  { label: "Careers",      href: "/careers" },
  { label: "Services",     href: "/services" },
  { label: "Support",      href: "/support" },
];

const CATEGORIES = [
  { label: "Electronics", icon: "laptop_mac",     slug: "electronics" },
  { label: "Property",    icon: "domain",          slug: "property" },
  { label: "Cars",        icon: "directions_car",  slug: "cars" },
  { label: "Jobs",        icon: "work",            slug: "jobs" },
  { label: "Services",    icon: "handyman",        slug: "services" },
  { label: "Fashion",     icon: "checkroom",       slug: "fashion" },
  { label: "Furniture",   icon: "chair",           slug: "furniture" },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const catRef    = useRef(null);

  const [search,      setSearch]      = useState("");
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);

  const user       = useSelector((s) => s.auth?.user);
  const userName   = user?.displayName || user?.name || "Guest";
  const isLoggedIn = !!user;

  /* Close drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setCatOpen(false);
  }, [location.pathname]);

  /* Lock scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Close category dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const activeHref = NAV_LINKS.find((l) => location.pathname === l.href)?.href;

  /* ─── NAV HEIGHT ──────────────────────────────────────────────────────────
     Desktop: top-bar (h-20) + secondary-nav (~40px) ≈ 128px  → pt-32
     Mobile:  top-bar (h-16) + optional search bar             → pt-16/20
  ─────────────────────────────────────────────────────────────────────────── */

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-white dark:bg-[#061E29] shadow-sm">

        {/* ══ TOP BAR ══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between w-full px-4 md:px-8 h-16 md:h-20 max-w-[1920px] mx-auto gap-3">

          {/* LEFT ── burger + logo + category */}
          <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">

            {/* Burger — mobile only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[#061E29] dark:text-white text-2xl">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>

            {/* Logo */}
            <Link to="/" className="text-xl md:text-2xl font-black text-[#061E29] dark:text-white tracking-tighter font-headline">
              Tijaraa
            </Link>

            {/* Category dropdown — desktop */}
            <div ref={catRef} className="relative hidden lg:block">
              <button
                onClick={() => setCatOpen((o) => !o)}
                className="flex items-center gap-1.5 text-on-surface font-medium py-2 px-3 rounded-lg hover:bg-surface-container-high transition-colors text-sm"
              >
                <span className="material-symbols-outlined text-lg">grid_view</span>
                <span>Categories</span>
                <span
                  className="material-symbols-outlined text-base transition-transform duration-200"
                  style={{ transform: catOpen ? "rotate(180deg)" : "rotate(0)" }}
                >
                  expand_more
                </span>
              </button>

              {catOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-surface-container-high py-2 z-50">
                  {CATEGORIES.map(({ label, icon, slug }) => (
                    <button
                      key={slug}
                      onClick={() => { navigate(`/category/${slug}`); setCatOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors text-sm font-medium text-on-surface"
                    >
                      <span className="material-symbols-outlined text-secondary text-xl">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTRE ── search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative flex items-center w-full bg-surface-container-low rounded-full px-5 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-secondary/25 transition-all">
              <span className="material-symbols-outlined text-outline text-xl select-none">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search goods, property, careers…"
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-outline-variant outline-none min-w-0"
              />
              <div className="h-5 w-px bg-outline-variant/40 mx-1 hidden lg:block" />
              <span className="hidden lg:flex items-center gap-1 text-secondary font-semibold text-xs whitespace-nowrap cursor-pointer">
                <span className="material-symbols-outlined text-sm">location_on</span>
                New York
              </span>
            </div>
          </form>

          {/* RIGHT ── actions */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">

            {/* Search icon — mobile */}
            <button
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[#061E29] dark:text-white">
                {searchOpen ? "close" : "search"}
              </span>
            </button>

            {/* Greeting — xl+ */}
            {isLoggedIn && (
              <span className="hidden xl:block text-sm text-on-surface-variant whitespace-nowrap mr-1">
                Good Morning,{" "}
                <span className="text-on-surface font-bold">{userName}</span>
              </span>
            )}

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              aria-label="Cart"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-[#1D546D]/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[#061E29] dark:text-white">shopping_cart</span>
            </button>

            {/* Profile — sm+ */}
            <button
              onClick={() => navigate(isLoggedIn ? "/profile" : "/auth/login")}
              aria-label="Profile"
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-[#1D546D]/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[#061E29] dark:text-white">person</span>
            </button>

            {/* Sell */}
            <button
              onClick={() => navigate("/sell")}
              className="bg-[#30647E] text-white px-4 md:px-5 py-2 rounded-full font-semibold text-sm hover:bg-[#061E29] transition-all active:scale-95 ml-1 whitespace-nowrap"
            >
              Sell
            </button>
          </div>
        </div>

        {/* ══ MOBILE SEARCH BAR (slide down) ═══════════════════════════════ */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <form onSubmit={handleSearch} className="px-4 pb-3 pt-1">
            <div className="flex items-center bg-surface-container-low rounded-full px-4 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-secondary/25">
              <span className="material-symbols-outlined text-outline text-xl">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search goods, property, careers…"
                autoFocus={searchOpen}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-outline-variant outline-none"
              />
              {search && (
                <button type="submit" className="text-secondary font-bold text-sm pr-1">Go</button>
              )}
            </div>
          </form>
        </div>

        {/* ══ SECONDARY NAV — desktop only ══════════════════════════════════ */}
        <nav className="hidden md:flex border-t border-surface-container-high bg-white dark:bg-[#061E29] justify-center py-2 gap-6 lg:gap-10 overflow-x-auto">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className={`px-2 py-1 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeHref === href
                  ? "text-[#30647E] font-bold border-b-2 border-[#30647E]"
                  : "text-[#191C1C] dark:text-gray-300 hover:text-[#30647E]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ══ MOBILE DRAWER ═════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        aria-label="Site navigation"
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-[300px] z-50 bg-white dark:bg-[#061E29] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-surface-container-high flex-shrink-0">
          <Link
            to="/"
            className="text-xl font-black text-[#061E29] dark:text-white tracking-tighter font-headline"
          >
            Tijaraa
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[#061E29] dark:text-white">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Auth state */}
          {isLoggedIn ? (
            <div className="px-5 py-4 border-b border-surface-container-high">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-0.5">
                Good Morning
              </p>
              <p className="text-base font-bold text-on-surface font-headline">{userName}</p>
            </div>
          ) : (
            <div className="px-5 py-4 border-b border-surface-container-high flex gap-3">
              <button
                onClick={() => { navigate("/auth/login"); setMobileOpen(false); }}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#30647E] text-[#30647E] font-bold text-sm hover:bg-[#30647E]/5 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => { navigate("/auth/signup"); setMobileOpen(false); }}
                className="flex-1 py-2.5 rounded-xl bg-[#30647E] text-white font-bold text-sm hover:bg-[#061E29] transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Nav links */}
          <div className="py-3">
            <p className="px-5 pb-2 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              Menu
            </p>
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                  activeHref === href
                    ? "text-[#30647E] bg-[#30647E]/5 font-bold border-r-2 border-[#30647E]"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="h-px bg-surface-container-high mx-5" />

          {/* Categories */}
          <div className="py-3">
            <p className="px-5 pb-2 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              Categories
            </p>
            {CATEGORIES.map(({ label, icon, slug }) => (
              <button
                key={slug}
                onClick={() => { navigate(`/category/${slug}`); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-secondary text-xl">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Logged-in account links */}
          {isLoggedIn && (
            <>
              <div className="h-px bg-surface-container-high mx-5" />
              <div className="py-3">
                <p className="px-5 pb-2 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                  Account
                </p>
                {[
                  { label: "My Profile",   icon: "person",     href: "/profile" },
                  { label: "My Listings",  icon: "storefront", href: "/my-listings" },
                  { label: "Wishlist",     icon: "favorite",   href: "/wishlist" },
                  { label: "My Orders",    icon: "receipt",    href: "/orders" },
                ].map(({ label, icon, href }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-outline text-xl">{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Drawer footer — Post a Listing */}
        <div className="px-5 py-4 border-t border-surface-container-high flex-shrink-0">
          <button
            onClick={() => { navigate("/sell"); setMobileOpen(false); }}
            className="w-full py-3.5 rounded-xl bg-[#30647E] text-white font-bold text-sm hover:bg-[#061E29] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Post a Listing
          </button>
        </div>
      </aside>
    </>
  );
}