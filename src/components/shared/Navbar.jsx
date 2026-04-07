// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals", active: true },
  { label: "Deals", href: "/deals" },
  { label: "Careers", href: "/careers" },
  { label: "Services", href: "/services" },
  { label: "Support", href: "/support" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [location] = useState("New York, USA");

  // Pull user from Redux auth state — adjust selector to match your slice shape
  const user = useSelector((s) => s.auth?.user);
  const userName = user?.displayName || user?.name || "Guest";
  const isLoggedIn = !!user;

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white dark:bg-[#061E29] shadow-sm dark:shadow-none">
      {/* ── Top bar ── */}
      <div className="flex justify-between items-center w-full px-8 h-20 max-w-[1920px] mx-auto">

        {/* Brand + Category */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-black text-[#061E29] dark:text-white tracking-tighter font-headline"
          >
            Tijaraa
          </Link>

          {/* Category dropdown (placeholder — wire to your category page) */}
          <div className="relative group hidden lg:block">
            <button className="flex items-center gap-2 text-on-surface font-medium py-2 px-3 rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">menu</span>
              <span className="font-label text-sm">Shop by Category</span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl px-8"
        >
          <div className="relative flex items-center bg-surface-container-low rounded-full px-6 py-2.5 transition-all focus-within:ring-2 focus-within:ring-secondary/20">
            <span className="material-symbols-outlined text-outline select-none">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for luxury goods, property, or careers..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-outline-variant ml-2 outline-none"
            />
            <div className="h-6 w-px bg-outline-variant/30 mx-4" />
            <button
              type="button"
              className="flex items-center gap-1 text-secondary font-semibold text-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">location_on</span>
              {location}
            </button>
          </div>
        </form>

        {/* Trailing actions */}
        <div className="flex items-center gap-6">
          {isLoggedIn && (
            <div className="hidden xl:flex items-center gap-4 text-sm font-medium">
              <span className="text-on-surface-variant">
                Good Morning,{" "}
                <span className="text-on-surface font-bold">{userName}</span>
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="p-2 rounded-full hover:bg-[#f3f4f4] dark:hover:bg-[#1D546D]/20 transition-colors"
              aria-label="Cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate(isLoggedIn ? "/profile" : "/auth/login")}
              className="p-2 rounded-full hover:bg-[#f3f4f4] dark:hover:bg-[#1D546D]/20 transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">person</span>
            </button>

            {/* Sell CTA */}
            <button
              onClick={() => navigate("/sell")}
              className="bg-[#30647E] text-white px-6 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* ── Secondary nav ── */}
      <nav className="border-t border-surface-container-high bg-white dark:bg-[#061E29] flex justify-center py-2 gap-10">
        {NAV_LINKS.map(({ label, href, active }) => (
          <Link
            key={label}
            to={href}
            className={`px-2 py-1 text-sm font-medium transition-colors ${
              active
                ? "text-[#30647E] font-bold border-b-2 border-[#30647E]"
                : "text-[#191C1C] dark:text-gray-300 hover:text-[#30647E]"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}