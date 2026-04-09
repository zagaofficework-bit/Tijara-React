// src/components/home/CategoriesSection.jsx
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://www.zagainstitute.com/tijaraa/public/api";

const CATEGORY_META = {
  properties: { icon: "fa-city", gradient: "from-emerald-500 to-teal-600", lightBg: "#f0fdf4", iconColor: "#059669" },
  cars: { icon: "fa-car", gradient: "from-blue-500 to-indigo-600", lightBg: "#eff6ff", iconColor: "#2563eb" },
  bike: { icon: "fa-motorcycle", gradient: "from-orange-400 to-amber-500", lightBg: "#fff7ed", iconColor: "#d97706" },
  "electronics-appliances": { icon: "fa-laptop", gradient: "from-violet-500 to-purple-600", lightBg: "#f5f3ff", iconColor: "#7c3aed" },
  "commercial-vehicle-spare-parts": { icon: "fa-truck", gradient: "from-red-500 to-rose-600", lightBg: "#fff1f2", iconColor: "#e11d48" },
  "home-appliances": { icon: "fa-blender", gradient: "from-cyan-500 to-sky-600", lightBg: "#ecfeff", iconColor: "#0891b2" },
  jobs: { icon: "fa-briefcase", gradient: "from-green-500 to-emerald-600", lightBg: "#f0fdf4", iconColor: "#16a34a" },
  "fashion-acessories": { icon: "fa-shirt", gradient: "from-pink-500 to-fuchsia-600", lightBg: "#fdf4ff", iconColor: "#c026d3" },
  pets: { icon: "fa-paw", gradient: "from-yellow-500 to-amber-600", lightBg: "#fefce8", iconColor: "#ca8a04" },
  "books-sports-hobbies": { icon: "fa-book", gradient: "from-sky-500 to-blue-600", lightBg: "#f0f9ff", iconColor: "#0284c7" },
  "furnitures-gardens": { icon: "fa-couch", gradient: "from-lime-500 to-green-600", lightBg: "#f7fee7", iconColor: "#65a30d" },
  services: { icon: "fa-screwdriver-wrench", gradient: "from-slate-500 to-gray-600", lightBg: "#f8fafc", iconColor: "#475569" },
  mobile: { icon: "fa-mobile-screen", gradient: "from-blue-600 to-cyan-500", lightBg: "#eff6ff", iconColor: "#1d4ed8" },
  "bussinesses-industrial": { icon: "fa-industry", gradient: "from-zinc-600 to-stone-700", lightBg: "#fafafa", iconColor: "#52525b" },
};

export default function CategoriesSection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch(`${API_BASE}/get-parent-categories`)
  //     .then((r) => r.json())
  //     .then((json) => {
  //       if (!json.error && json.data) {
  //         const list = Array.isArray(json.data) ? json.data : json.data.data || [];
  //         setCategories(list);
  //       }
  //     })
  //     .catch(() => {
  //       // fallback to full categories and filter parent_category_id === null
  //       fetch(`${API_BASE}/get-categories`)
  //         .then((r) => r.json())
  //         .then((json) => {
  //           if (!json.error) {
  //             const all = json.data.data || [];
  //             setCategories(all.filter((c) => c.parent_category_id === null));
  //           }
  //         })
  //         .catch(console.error);
  //     })
  //     .finally(() => setLoading(false));
  // }, []);
  useEffect(() => {
    fetch(`${API_BASE}/get-categories`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) {
          const list = json.data?.data || [];
          setCategories(list); // ✅ NO FILTER
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [categories]);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-16 md:mb-24">

      {/* Header */}
      <div className="flex justify-between items-end mb-8 md:mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1 md:mb-2 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base hidden sm:block">
            Explore thousands of listings across our most popular departments.
          </p>
        </div>
        <button
          onClick={() => navigate("/categories")}
          className="text-secondary font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all text-sm flex-shrink-0 ml-4 group"
        >
          <span className="hidden sm:inline">View All</span>
          <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Scroll wrapper */}
      <div className="relative">

        {/* Left Arrow — always present at edge */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10
                     w-10 h-10 rounded-full bg-white border border-gray-200
                     flex items-center justify-center transition-all duration-200
                     disabled:opacity-0 disabled:pointer-events-none
                     hover:shadow-md hover:border-gray-300 hover:scale-105 shadow-sm"
          style={{ boxShadow: canScrollLeft ? "0 4px 12px rgba(0,0,0,0.12)" : "none" }}
        >
          <i className="fa-solid fa-chevron-left text-gray-600 text-xs" />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-3 pt-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl animate-pulse bg-gray-100"
                style={{ width: "clamp(120px, 16vw, 150px)", height: 160 }}
              />
            ))
            : categories.map((cat) => {
              const meta = CATEGORY_META[cat.slug] || {
                icon: "fa-tag",
                gradient: "from-gray-400 to-gray-500",
                lightBg: "#f5f5f5",
                iconColor: "#6b7280",
              };
              return (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  meta={meta}
                  onClick={() => navigate(`/category/${cat.slug}`)}
                />
              );
            })}
        </div>

        {/* Right Arrow — always present at edge */}
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          disabled={!canScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
                     w-10 h-10 rounded-full bg-white border border-gray-200
                     flex items-center justify-center transition-all duration-200
                     disabled:opacity-0 disabled:pointer-events-none
                     hover:shadow-md hover:border-gray-300 hover:scale-105 shadow-sm"
          style={{ boxShadow: canScrollRight ? "0 4px 12px rgba(0,0,0,0.12)" : "none" }}
        >
          <i className="fa-solid fa-chevron-right text-gray-600 text-xs" />
        </button>
      </div>
    </section>
  );
}

function CategoryCard({ cat, meta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-center text-center group cursor-pointer
                 bg-white rounded-2xl pt-6 pb-5 px-4 transition-all duration-200
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        width: "clamp(120px, 16vw, 150px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Icon circle */}
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: meta.lightBg }}
      >
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.translated_name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full rounded-2xl items-center justify-center"
          style={{ display: cat.image ? "none" : "flex" }}
        >
          <i
            className={`fa-solid ${meta.icon} text-xl md:text-2xl`}
            style={{ color: meta.iconColor }}
          />
        </div>
      </div>

      {/* Label */}
      <span className="font-semibold text-xs md:text-sm text-gray-800 leading-tight line-clamp-2 w-full">
        {cat.translated_name}
      </span>

      {/* Subtle arrow */}
      <div
        className="mt-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: meta.lightBg }}
      >
        <i className="fa-solid fa-arrow-right text-[9px]" style={{ color: meta.iconColor }} />
      </div>
    </button>
  );
}