// src/pages/CategoryPage.jsx
// Route: <Route path="/category/:slug" element={<CategoryPage />} />
//
// Component file structure:
//   src/pages/CategoryPage.jsx                    ← this file
//   src/components/category/FilterSidebar.jsx     ← filter sidebar
//   src/components/category/ItemsGrid.jsx         ← grid + skeletons
//   src/components/category/ItemCard.jsx          ← single card

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FilterSidebar from "../../../../components/shared/FilterSidebar"
import ItemsGrid from "../components/ItemsGrid";

/* ─────────────────────────────────────────────────────────────── */
const API_BASE = "https://www.zagainstitute.com/tijaraa/public/api";

const CATEGORY_META = {
  properties:                        { icon: "fa-city",               color: "#059669", bg: "#f0fdf4",  accent: "#d1fae5" },
  cars:                              { icon: "fa-car",                color: "#2563eb", bg: "#eff6ff",  accent: "#dbeafe" },
  bike:                              { icon: "fa-motorcycle",         color: "#d97706", bg: "#fff7ed",  accent: "#fde68a" },
  "electronics-appliances":         { icon: "fa-laptop",             color: "#7c3aed", bg: "#f5f3ff",  accent: "#ede9fe" },
  "commercial-vehicle-spare-parts": { icon: "fa-truck",              color: "#e11d48", bg: "#fff1f2",  accent: "#ffe4e6" },
  "home-appliances":                { icon: "fa-blender",            color: "#0891b2", bg: "#ecfeff",  accent: "#cffafe" },
  jobs:                             { icon: "fa-briefcase",          color: "#16a34a", bg: "#f0fdf4",  accent: "#dcfce7" },
  "fashion-acessories":            { icon: "fa-shirt",              color: "#c026d3", bg: "#fdf4ff",  accent: "#fae8ff" },
  pets:                             { icon: "fa-paw",                color: "#ca8a04", bg: "#fefce8",  accent: "#fef9c3" },
  "books-sports-hobbies":          { icon: "fa-book",               color: "#0284c7", bg: "#f0f9ff",  accent: "#e0f2fe" },
  "furnitures-gardens":            { icon: "fa-couch",              color: "#65a30d", bg: "#f7fee7",  accent: "#ecfccb" },
  services:                         { icon: "fa-screwdriver-wrench", color: "#475569", bg: "#f8fafc",  accent: "#e2e8f0" },
  mobile:                           { icon: "fa-mobile-screen",      color: "#1d4ed8", bg: "#eff6ff",  accent: "#dbeafe" },
  "bussinesses-industrial":        { icon: "fa-industry",           color: "#52525b", bg: "#fafafa",  accent: "#e4e4e7" },
};

const DEFAULT_FILTERS = {
  sort_by:   "latest",
  min_price: "",
  max_price: "",
  state_id:  "",
  city_id:   "",
  area_id:   "",
  search:    "",
};

/* ─────────────────────────────────────────────────────────────── */
export default function ItemsSubCategory() {
  const { slug } = useParams();
  const navigate = useNavigate();

  /* ── Category & subcategories ── */
  const [category,      setCategory]      = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [catLoading,    setCatLoading]    = useState(true);

  /* ── Active subcategory ── */
  const [activeSubcat, setActiveSubcat] = useState("all");

  /* ── Custom fields (dynamic per subcategory from API) ── */
  const [customFields, setCustomFields] = useState([]);

  /* ── Items ── */
  const [items,        setItems]        = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError,   setItemsError]   = useState(null);

  /* ── Pagination ── */
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage,    setLastPage]    = useState(1);
  const [total,       setTotal]       = useState(0);

  /* ── Filter state (live edits) vs applied (sent to API) ── */
  const [filters,        setFilters]        = useState({ ...DEFAULT_FILTERS });
  const [appliedFilters, setAppliedFilters] = useState({ ...DEFAULT_FILTERS });

  /* ── Mobile filter drawer ── */
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  /* ── Subcategory pill scroll ── */
  const filterRef       = useRef(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ════════════════════════════════════════════════════════ */
  /*  1. Load category + subcategories on slug change        */
  /* ════════════════════════════════════════════════════════ */
  useEffect(() => {
    setCatLoading(true);
    setActiveSubcat("all");
    setItems([]);
    setCustomFields([]);
    setFilters({ ...DEFAULT_FILTERS });
    setAppliedFilters({ ...DEFAULT_FILTERS });
    setCurrentPage(1);

    fetch(`${API_BASE}/get-categories`)
      .then(r => r.json())
      .then(json => {
        if (!json.error) {
          const all   = json.data.data || [];
          const found = all.find(c => c.slug === slug);
          setCategory(found || null);
          setSubcategories(found?.subcategories || []);
        }
      })
      .catch(console.error)
      .finally(() => setCatLoading(false));
  }, [slug]);

  /* ════════════════════════════════════════════════════════ */
  /*  2. Fetch custom fields when subcategory changes        */
  /* ════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (activeSubcat === "all") { setCustomFields([]); return; }
    const sub = subcategories.find(s => s.slug === activeSubcat);
    if (!sub?.id) return;

    fetch(`${API_BASE}/get-customfields?category_id=${sub.id}`)
      .then(r => r.json())
      .then(json => { if (!json.error) setCustomFields(json.data || []); })
      .catch(console.error);
  }, [activeSubcat, subcategories]);

  /* ════════════════════════════════════════════════════════ */
  /*  3. Fetch items via /api/get-item                       */
  /* ════════════════════════════════════════════════════════ */
  const fetchItems = useCallback(
    (page = 1, applied = appliedFilters, subcat = activeSubcat) => {
      setItemsLoading(true);
      setItemsError(null);

      const params = new URLSearchParams();
      params.set("category_slug", slug);
      if (subcat !== "all")  params.set("subcategory_slug", subcat);
      if (applied.sort_by)   params.set("sort_by",          applied.sort_by);
      if (applied.min_price) params.set("min_price",        applied.min_price);
      if (applied.max_price) params.set("max_price",        applied.max_price);
      if (applied.state_id)  params.set("state",            applied.state_id);
      if (applied.city_id)   params.set("city",             applied.city_id);
      if (applied.area_id)   params.set("area",             applied.area_id);
      if (applied.search)    params.set("search",           applied.search);

      /* Dynamic custom fields cf_<id> */
      Object.entries(applied).forEach(([k, v]) => {
        if (k.startsWith("cf_") && v) params.set(k, v);
      });

      params.set("page", page);

      fetch(`${API_BASE}/get-item?${params}`)
        .then(r => r.json())
        .then(json => {
          if (!json.error) {
            const d = json.data;
            setItems(d.data || []);
            setCurrentPage(d.current_page || 1);
            setLastPage(d.last_page || 1);
            setTotal(d.total || 0);
          } else {
            setItemsError(json.message || "Failed to load listings.");
          }
        })
        .catch(() => setItemsError("Network error. Please try again."))
        .finally(() => setItemsLoading(false));
    },
    // eslint-disable-next-line
    [slug]
  );

  /* Auto-fetch when category loaded or subcat changes */
  useEffect(() => {
    if (category) fetchItems(1, appliedFilters, activeSubcat);
    // eslint-disable-next-line
  }, [category, activeSubcat]);

  /* ════════════════════════════════════════════════════════ */
  /*  4. Subcategory pill scroll arrows                      */
  /* ════════════════════════════════════════════════════════ */
  const updateArrows = () => {
    const el = filterRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = filterRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [subcategories]);

  /* ════════════════════════════════════════════════════════ */
  /*  5. Handlers                                            */
  /* ════════════════════════════════════════════════════════ */
  const handleSubcatChange = newSlug => {
    setActiveSubcat(newSlug);
    setCurrentPage(1);
    /* wipe custom field filters on subcat switch */
    const cleaned = Object.fromEntries(
      Object.entries(appliedFilters).filter(([k]) => !k.startsWith("cf_"))
    );
    setFilters(cleaned);
    setAppliedFilters(cleaned);
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    fetchItems(1, filters, activeSubcat);
    setMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setAppliedFilters({ ...DEFAULT_FILTERS });
    fetchItems(1, DEFAULT_FILTERS, activeSubcat);
  };

  const removeFilter = patch => {
    const next = { ...appliedFilters, ...patch };
    setFilters(next);
    setAppliedFilters(next);
    fetchItems(1, next, activeSubcat);
  };

  const goToPage = p => {
    setCurrentPage(p);
    fetchItems(p, appliedFilters, activeSubcat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollFilters = dir =>
    filterRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  /* ════════════════════════════════════════════════════════ */
  /*  Derived                                                */
  /* ════════════════════════════════════════════════════════ */
  const meta             = CATEGORY_META[slug] || { icon: "fa-tag", color: "#6b7280", bg: "#f9fafb", accent: "#e5e7eb" };
  const activeSubcatData = subcategories.find(s => s.slug === activeSubcat);
  const activeFilterCount = Object.entries(appliedFilters)
    .filter(([k, v]) => v && k !== "sort_by").length;

  /* ════════════════════════════════════════════════════════ */
  /*  Loading skeleton                                       */
  /* ════════════════════════════════════════════════════════ */
  if (catLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <div className="h-4 w-36 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="h-32 rounded-2xl bg-gray-100 animate-pulse mb-8" />
        <div className="flex gap-3 mb-8">
          {[1,2,3,4,5].map(i => <div key={i} className="h-9 w-24 rounded-full bg-gray-100 animate-pulse" />)}
        </div>
        <div className="flex gap-6">
          <div className="hidden lg:block w-[280px] shrink-0 rounded-2xl bg-gray-100 animate-pulse h-[560px]" />
          <div className="flex-1 grid grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[4/5]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════ */
  /*  404                                                    */
  /* ════════════════════════════════════════════════════════ */
  if (!category) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-24 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <i className="fa-solid fa-circle-exclamation text-2xl text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: "Manrope, sans-serif" }}>Category not found</h2>
        <p className="text-sm text-gray-500" style={{ fontFamily: "Manrope, sans-serif" }}>The category you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════ */
  /*  Main Render                                            */
  /* ════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-10">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6" aria-label="breadcrumb">
        <button
          onClick={() => navigate("/")}
          className="hover:text-gray-700 transition-colors font-medium"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Home
        </button>
        <i className="fa-solid fa-chevron-right text-[9px] text-gray-300" />
        <span className="font-semibold" style={{ color: meta.color, fontFamily: "Manrope, sans-serif" }}>
          {category.translated_name}
        </span>
        {activeSubcat !== "all" && activeSubcatData && (
          <>
            <i className="fa-solid fa-chevron-right text-[9px] text-gray-300" />
            <span className="text-gray-700 font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>
              {activeSubcatData.translated_name}
            </span>
          </>
        )}
      </nav>

      {/* ── Hero Banner ── */}
      <div
        className="relative rounded-3xl p-6 md:p-10 mb-8 overflow-hidden"
        style={{ backgroundColor: meta.bg }}
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-25" style={{ backgroundColor: meta.accent }} />
        <div className="absolute right-20 -bottom-8 w-32 h-32 rounded-full opacity-15" style={{ backgroundColor: meta.color }} />
        <div className="absolute -left-6 bottom-0 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: meta.color }} />

        <div className="relative flex items-center gap-5 md:gap-8">
          {/* Category icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-md">
            {category.image ? (
              <>
                <img
                  src={category.image}
                  alt={category.translated_name}
                  className="w-10 h-10 object-contain"
                  onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                />
                <div className="w-full h-full rounded-2xl items-center justify-center hidden">
                  <i className={`fa-solid ${meta.icon} text-2xl`} style={{ color: meta.color }} />
                </div>
              </>
            ) : (
              <i className={`fa-solid ${meta.icon} text-3xl`} style={{ color: meta.color }} />
            )}
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl md:text-3xl font-black tracking-tight mb-1"
              style={{ color: meta.color, fontFamily: "Manrope, sans-serif" }}
            >
              {activeSubcat !== "all" && activeSubcatData
                ? `${activeSubcatData.translated_name} in ${category.translated_name}`
                : category.translated_name}
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: "Manrope, sans-serif" }}>
              {itemsLoading
                ? "Loading listings…"
                : `${total.toLocaleString()} listing${total !== 1 ? "s" : ""} found`}
              {subcategories.length > 0 && activeSubcat === "all" && (
                <span className="ml-2 opacity-60">· {subcategories.length} subcategories</span>
              )}
            </p>
          </div>

          {/* Active filter pill (desktop) */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shrink-0 transition-all hover:opacity-80"
              style={{ backgroundColor: meta.color, fontFamily: "Manrope, sans-serif" }}
            >
              <i className="fa-solid fa-xmark text-[10px]" />
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </button>
          )}
        </div>
      </div>

      {/* ── Subcategory Pill Bar ── */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => scrollFilters(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll filters left"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white dark:bg-[#061E29] border border-gray-200 dark:border-[#1D546D]/40 shadow-sm flex items-center justify-center transition-all hover:shadow-md hover:scale-105 disabled:opacity-30 disabled:pointer-events-none"
          >
            <i className="fa-solid fa-chevron-left text-gray-500 text-xs" />
          </button>

          <div
            ref={filterRef}
            className="flex gap-2 overflow-x-auto flex-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={() => handleSubcatChange("all")}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border"
              style={activeSubcat === "all"
                ? { backgroundColor: meta.color, color: "white", borderColor: meta.color, boxShadow: `0 4px 14px ${meta.color}45`, fontFamily: "Manrope, sans-serif" }
                : { backgroundColor: "white", color: "#374151", borderColor: "#e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", fontFamily: "Manrope, sans-serif" }}
            >
              <i className="fa-solid fa-border-all text-[11px]" /> All
            </button>

            {subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => handleSubcatChange(sub.slug)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border"
                style={activeSubcat === sub.slug
                  ? { backgroundColor: meta.color, color: "white", borderColor: meta.color, boxShadow: `0 4px 14px ${meta.color}45`, fontFamily: "Manrope, sans-serif" }
                  : { backgroundColor: "white", color: "#374151", borderColor: "#e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", fontFamily: "Manrope, sans-serif" }}
              >
                {sub.image && (
                  <img src={sub.image} alt="" className="w-3.5 h-3.5 object-contain rounded" />
                )}
                {sub.translated_name}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollFilters(1)}
            disabled={!canScrollRight}
            aria-label="Scroll filters right"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white dark:bg-[#061E29] border border-gray-200 dark:border-[#1D546D]/40 shadow-sm flex items-center justify-center transition-all hover:shadow-md hover:scale-105 disabled:opacity-30 disabled:pointer-events-none"
          >
            <i className="fa-solid fa-chevron-right text-gray-500 text-xs" />
          </button>
        </div>
      )}

      {/* ── Active filter tags ── */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-gray-400 font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>Active:</span>

          {appliedFilters.search && (
            <FilterTag label={`"${appliedFilters.search}"`} meta={meta}
              onRemove={() => removeFilter({ search: "" })} />
          )}
          {(appliedFilters.min_price || appliedFilters.max_price) && (
            <FilterTag
              label={`₹${appliedFilters.min_price || "0"} – ₹${appliedFilters.max_price || "∞"}`}
              meta={meta}
              onRemove={() => removeFilter({ min_price: "", max_price: "" })}
            />
          )}
          {appliedFilters.state_id && (
            <FilterTag label="Location" meta={meta}
              onRemove={() => removeFilter({ state_id: "", city_id: "", area_id: "" })} />
          )}
          {Object.entries(appliedFilters)
            .filter(([k, v]) => k.startsWith("cf_") && v)
            .map(([k, v]) => (
              <FilterTag key={k} label={v} meta={meta} onRemove={() => removeFilter({ [k]: "" })} />
            ))}

          <button
            onClick={resetFilters}
            className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors ml-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Two-column layout: Sidebar LEFT + Items RIGHT ── */}
      <div className="flex gap-6 items-start">

        {/* ══ LEFT: Desktop Filter Sidebar (sticky) ══ */}
        <aside className="hidden lg:block w-[280px] shrink-0 sticky top-4">
          <FilterSidebar
            filters={filters}
            meta={meta}
            customFields={customFields}
            onChange={patch => setFilters(f => ({ ...f, ...patch }))}
            onApply={applyFilters}
            onReset={resetFilters}
          />
        </aside>

        {/* ══ RIGHT: Items main content ══ */}
        <main className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">

            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold bg-white dark:bg-[#061E29] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl hover:border-gray-300 transition-colors"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              <i className="fa-solid fa-sliders text-sm" style={{ color: meta.color }} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center" style={{ backgroundColor: meta.color }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile sort */}
            <div className="lg:hidden ml-auto">
              <select
                value={filters.sort_by}
                onChange={e => {
                  const p = { ...filters, sort_by: e.target.value };
                  setFilters(p); setAppliedFilters(p);
                  fetchItems(1, p, activeSubcat);
                }}
                className="text-[12px] font-semibold bg-white dark:bg-[#061E29] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl px-3 py-2.5 text-gray-700 dark:text-gray-200 outline-none"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                <option value="latest">Newest</option>
                <option value="price_low">Price ↑</option>
                <option value="price_high">Price ↓</option>
                <option value="popular">Popular</option>
              </select>
            </div>

            {/* Desktop result count */}
            <p className="hidden lg:block text-[13px] text-gray-400 ml-auto" style={{ fontFamily: "Manrope, sans-serif" }}>
              {itemsLoading
                ? "Loading…"
                : `Page ${currentPage} of ${lastPage} · ${total.toLocaleString()} listings`}
            </p>
          </div>

          {/* Error */}
          {itemsError && (
            <div className="flex items-center gap-3 p-4 mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl">
              <i className="fa-solid fa-circle-exclamation text-red-500 flex-shrink-0" />
              <p className="text-[13px] text-red-600 dark:text-red-400 flex-1" style={{ fontFamily: "Manrope, sans-serif" }}>
                {itemsError}
              </p>
              <button
                onClick={() => fetchItems(currentPage, appliedFilters, activeSubcat)}
                className="text-[12px] font-bold text-red-600 dark:text-red-400 hover:underline shrink-0"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Items Grid (imported component) */}
          <ItemsGrid items={items} loading={itemsLoading} meta={meta} />

          {/* Pagination */}
          {!itemsLoading && lastPage > 1 && (
            <Pagination current={currentPage} total={lastPage} onPageChange={goToPage} meta={meta} />
          )}
        </main>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div
            className="absolute right-0 top-0 h-full w-[320px] max-w-[92vw] overflow-y-auto shadow-2xl"
            style={{ animation: "slideFromRight 0.22s ease" }}
          >
            <FilterSidebar
              filters={filters}
              meta={meta}
              customFields={customFields}
              onChange={patch => setFilters(f => ({ ...f, ...patch }))}
              onApply={applyFilters}
              onReset={resetFilters}
              isMobile
              onClose={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  FILTER TAG                                                 */
/* ═══════════════════════════════════════════════════════════ */
function FilterTag({ label, meta, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border"
      style={{
        backgroundColor: `${meta.color}12`,
        color: meta.color,
        borderColor: `${meta.color}30`,
        fontFamily: "Manrope, sans-serif",
      }}
    >
      {label}
      <button onClick={onRemove} className="hover:opacity-60 transition-opacity leading-none">
        <i className="fa-solid fa-xmark text-[9px]" />
      </button>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  PAGINATION                                                 */
/* ═══════════════════════════════════════════════════════════ */
function Pagination({ current, total, onPageChange, meta }) {
  if (total <= 1) return null;

  const raw = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 2 && i <= current + 2)) raw.push(i);
  }
  const pages = [];
  let prev = null;
  for (const p of raw) {
    if (prev && p - prev > 1) pages.push("…");
    pages.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12 mb-4">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 rounded-xl border border-gray-200 dark:border-[#1D546D]/40 bg-white dark:bg-[#061E29] flex items-center justify-center text-gray-500 hover:border-gray-300 transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <i className="fa-solid fa-chevron-left text-xs" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="w-9 h-9 rounded-xl border text-sm font-bold transition-all"
            style={p === current
              ? { backgroundColor: meta.color, borderColor: meta.color, color: "white", boxShadow: `0 4px 14px ${meta.color}45`, fontFamily: "Manrope, sans-serif" }
              : { backgroundColor: "white", borderColor: "#e5e7eb", color: "#374151", fontFamily: "Manrope, sans-serif" }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="w-9 h-9 rounded-xl border border-gray-200 dark:border-[#1D546D]/40 bg-white dark:bg-[#061E29] flex items-center justify-center text-gray-500 hover:border-gray-300 transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <i className="fa-solid fa-chevron-right text-xs" />
      </button>
    </div>
  );
}