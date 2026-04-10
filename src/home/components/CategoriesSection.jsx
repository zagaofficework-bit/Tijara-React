// src/components/home/CategoriesSection.jsx
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── COLOUR TOKENS (light theme) ─────────────────────────────────
// brand      #1D546D   CTA buttons, active states
// brandLight #EBF4F7   hover bg tint
// brandMid   #5F9598   icon accent
// surface    #FFFFFF   card bg
// surface2   #F7F9FA   section bg / offset
// border     #E4EAED   dividers
// textHi     #0E1E25   primary text
// textLo     #6B8898   muted labels
// ─────────────────────────────────────────────────────────────────

const FF = "Manrope, sans-serif";
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

// ─── DUMMY CATEGORIES ────────────────────────────────────────────
// 📌 DUMMY DATA IS HERE — replace with real API data when ready
// When API is ready:
//   1. Uncomment the useEffect below that calls /api/get-categories
//   2. Delete the DUMMY_CATEGORIES array
//   3. Change: setCategories(DUMMY_CATEGORIES) → setCategories([])
// ─────────────────────────────────────────────────────────────────
const DUMMY_CATEGORIES = [
  { id: 1,  slug: "properties",                     translated_name: "Properties",        image: null },
  { id: 2,  slug: "cars",                            translated_name: "Cars",              image: null },
  { id: 3,  slug: "bike",                            translated_name: "Bikes",             image: null },
  { id: 4,  slug: "electronics-appliances",          translated_name: "Electronics",       image: null },
  { id: 5,  slug: "commercial-vehicle-spare-parts",  translated_name: "Spare Parts",       image: null },
  { id: 6,  slug: "home-appliances",                 translated_name: "Home Appliances",   image: null },
  { id: 7,  slug: "jobs",                            translated_name: "Jobs",              image: null },
  { id: 8,  slug: "fashion-acessories",              translated_name: "Fashion",           image: null },
  { id: 9,  slug: "pets",                            translated_name: "Pets",              image: null },
  { id: 10, slug: "books-sports-hobbies",            translated_name: "Sports & Hobbies",  image: null },
  { id: 11, slug: "furnitures-gardens",              translated_name: "Furniture",         image: null },
  { id: 12, slug: "services",                        translated_name: "Services",          image: null },
  { id: 13, slug: "mobile",                          translated_name: "Mobiles",           image: null },
  { id: 14, slug: "bussinesses-industrial",          translated_name: "Business",          image: null },
];

// Each category gets a unique icon + light tinted bg on the icon circle
const CATEGORY_META = {
  properties:                     { icon: "fa-city",                iconBg: "#EBF4F7", iconColor: "#1D546D" },
  cars:                           { icon: "fa-car",                 iconBg: "#FFF8EC", iconColor: "#C77A00" },
  bike:                           { icon: "fa-motorcycle",          iconBg: "#FFF1F0", iconColor: "#D44C3A" },
  "electronics-appliances":       { icon: "fa-laptop",              iconBg: "#F0EDFF", iconColor: "#6A3FC8" },
  "commercial-vehicle-spare-parts":{ icon: "fa-truck",              iconBg: "#F0FBF4", iconColor: "#1A8A4A" },
  "home-appliances":              { icon: "fa-blender",             iconBg: "#EBF4F7", iconColor: "#1D546D" },
  jobs:                           { icon: "fa-briefcase",           iconBg: "#FFF8EC", iconColor: "#C77A00" },
  "fashion-acessories":           { icon: "fa-shirt",               iconBg: "#FFF0F7", iconColor: "#C0346B" },
  pets:                           { icon: "fa-paw",                 iconBg: "#FFF8EC", iconColor: "#C77A00" },
  "books-sports-hobbies":         { icon: "fa-book",                iconBg: "#EBF4F7", iconColor: "#1D546D" },
  "furnitures-gardens":           { icon: "fa-couch",               iconBg: "#F0FBF4", iconColor: "#1A8A4A" },
  services:                       { icon: "fa-screwdriver-wrench",  iconBg: "#F0EDFF", iconColor: "#6A3FC8" },
  mobile:                         { icon: "fa-mobile-screen",       iconBg: "#FFF0F7", iconColor: "#C0346B" },
  "bussinesses-industrial":       { icon: "fa-industry",            iconBg: "#F7F7F7", iconColor: "#444444" },
};

export default function CategoriesSection() {
  const navigate  = useNavigate();
  const scrollRef = useRef(null);
  const [canLeft,     setCanLeft]     = useState(false);
  const [canRight,    setCanRight]    = useState(true);
  const [categories,  setCategories]  = useState(DUMMY_CATEGORIES);
  const [loading,     setLoading]     = useState(false);

  // ─── REAL API — uncomment when backend is ready ───────────────
  // useEffect(() => {
  //   setLoading(true);
  //   fetch("https://www.zagainstitute.com/tijaraa/public/api/get-categories")
  //     .then(r => r.json())
  //     .then(json => {
  //       if (!json.error) setCategories(json.data?.data || []);
  //     })
  //     .catch(console.error)
  //     .finally(() => setLoading(false));
  // }, []);
  // ─────────────────────────────────────────────────────────────

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => { el.removeEventListener("scroll", updateArrows); window.removeEventListener("resize", updateArrows); };
  }, [categories]);

  const scrollBy = (dir) => scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 pb-12 md:pb-16 max-w-[1440px] mx-auto">

      {/* Section header */}
      <div className="flex justify-between items-end mb-7">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] mb-1" style={{ color: C.brandMid, fontFamily: FF }}>
            What are you looking for?
          </p>
          <h2 className="font-black leading-tight" style={{ color: C.textHi, fontFamily: FF, fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)", letterSpacing: "-0.02em" }}>
            Browse by Category
          </h2>
        </div>
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider shrink-0 ml-4 transition-all"
          style={{ color: C.brand, background: "none", border: "none", cursor: "pointer", fontFamily: FF }}
          onMouseEnter={(e) => { e.currentTarget.style.gap = "8px"; }}
          onMouseLeave={(e) => { e.currentTarget.style.gap = "6px"; }}
        >
          <span className="hidden sm:inline">View All</span>
          <i className="fa-solid fa-arrow-right text-[11px]" />
        </button>
      </div>

      {/* Scroll wrapper */}
      <div className="relative">

        {/* Left arrow */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          disabled={!canLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none"
          style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.10)", color: C.textHi, cursor: "pointer" }}
        >
          <i className="fa-solid fa-chevron-left text-[11px]" />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 pt-1 px-0.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 rounded-2xl animate-pulse" style={{ width: 116, height: 140, background: C.surface2, border: `1px solid ${C.border}` }} />
              ))
            : categories.map((cat) => {
                const meta = CATEGORY_META[cat.slug] || { icon: "fa-tag", iconBg: C.brandLight, iconColor: C.brand };
                return (
                  <CategoryCard key={cat.id} cat={cat} meta={meta} onClick={() => navigate(`/category/${cat.slug}`)} />
                );
              })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          disabled={!canRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none"
          style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.10)", color: C.textHi, cursor: "pointer" }}
        >
          <i className="fa-solid fa-chevron-right text-[11px]" />
        </button>
      </div>
    </section>
  );
}

function CategoryCard({ cat, meta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-center text-center group rounded-2xl pt-5 pb-4 px-3 transition-all duration-200 focus:outline-none cursor-pointer"
      style={{
        width: "clamp(100px, 13vw, 124px)",
        background: "#FFFFFF",
        border: "1.5px solid #E4EAED",
        fontFamily: FF,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#1D546D";
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(29,84,109,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E4EAED";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Icon circle */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
        style={{ background: meta.iconBg }}
      >
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.translated_name}
            className="w-6 h-6 object-contain"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        <div
          style={{ display: cat.image ? "none" : "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
          className="rounded-xl"
        >
          <i className={`fa-solid ${meta.icon} text-[18px]`} style={{ color: meta.iconColor }} />
        </div>
      </div>

      {/* Label — dark text on white card = high contrast */}
      <span
        className="font-bold text-[11.5px] leading-snug line-clamp-2 w-full"
        style={{ color: "#0E1E25" }}
      >
        {cat.translated_name}
      </span>
    </button>
  );
}