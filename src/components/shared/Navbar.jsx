// src/components/Navbar.jsx
import { useState, useEffect } from "react";
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

  // ── Must be before useEffect so `user` is available inside it ──
  const user = useSelector((s) => s.auth?.user);
  const userName = user?.displayName || user?.name || "Guest";
  const isLoggedIn = !!user;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
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

  return (
    <header className="fixed top-0 z-50 w-full bg-white dark:bg-[#061E29] border-b border-gray-100 dark:border-[#1D546D]/30 shadow-sm">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-6 lg:px-10 h-16 max-w-[1920px] mx-auto gap-4">

        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-black text-[#061E29] dark:text-white tracking-tight shrink-0"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Tijaraa
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-[700px] mx-6"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-[#1D546D]/60 rounded-xl bg-gray-50 dark:bg-[#0d2f3f] hover:border-[#30647E] focus-within:border-[#30647E] focus-within:ring-2 focus-within:ring-[#30647E]/10 transition-all">

            {/* ✅ Correct FontAwesome icon */}
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
        <div className="flex items-center gap-2 shrink-0">

          {/* Location */}
          <div
            onClick={handleLocation}
            className="flex items-center gap-1.5 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-[#30647E] dark:hover:text-[#5a9ab8] transition-colors whitespace-nowrap shrink-0 mr-2"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            <i className="fa-solid fa-location-dot text-[14px]" />
            <span className="text-[13px] font-medium max-w-[140px] truncate">{location}</span>
          </div>

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
                onClick={() => navigate("/cart")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D546D]/20 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Cart"
              >
                <i className="fa-solid fa-cart-shopping text-[18px]" />
              </button>

              <button
                onClick={() => navigate("/sell")}
                className="px-3.5 py-1.5 text-[12.5px] font-semibold text-[#30647E] border border-[#30647E] rounded-lg hover:bg-[#30647E] hover:text-white transition-colors"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                + Sell
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/cart")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D546D]/20 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Cart"
              >
                <i className="fa-solid fa-cart-shopping text-[18px]" />
              </button>

              <button
                onClick={() => navigate("/auth/login")}
                className="px-3.5 py-1.5 text-[12.5px] font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#1D546D]/60 rounded-lg hover:border-[#30647E] hover:text-[#30647E] transition-colors"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Login
              </button>

              <button
                onClick={() => navigate("/auth/signup")}
                className="px-3.5 py-1.5 text-[12.5px] font-semibold bg-[#061E29] dark:bg-[#30647E] text-white rounded-lg hover:bg-[#30647E] dark:hover:bg-[#1D546D] transition-colors"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Secondary Nav ── */}
      <nav className="border-t border-gray-100 dark:border-[#1D546D]/20 bg-white dark:bg-[#061E29] px-6 lg:px-10">
        <div className="flex justify-center">
          <div className="flex items-center gap-10 max-w-[1200px] overflow-x-auto scrollbar-hide">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeLink === label;
              return (
                <Link
                  key={label}
                  to={href}
                  onClick={() => setActiveLink(label)}
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
  );
}