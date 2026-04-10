// src/components/category/FilterSidebar.jsx
// Props:
//   filters        – current filter state object
//   meta           – category color/icon meta
//   categories     – all categories list (for category tree)
//   customFields   – dynamic fields array from /api/get-customfields
//   onChange(patch) – update a single filter key
//   onApply()       – trigger fetch
//   onReset()       – clear all filters
//   isMobile        – boolean, shows close button
//   onClose()       – close mobile drawer

import { useState, useEffect } from "react";

const API_BASE = "https://www.zagainstitute.com/tijaraa/public/api";

const SORT_OPTIONS = [
  { value: "latest",     label: "Newest to Oldest",  icon: "fa-arrow-down-wide-short" },
  { value: "price_low",  label: "Price: Low → High",  icon: "fa-arrow-up-1-9" },
  { value: "price_high", label: "Price: High → Low",  icon: "fa-arrow-down-9-1" },
  { value: "popular",    label: "Most Popular",        icon: "fa-fire" },
];

export default function FilterSidebar({
  filters,
  meta,
  categories = [],
  customFields = [],
  onChange,
  onApply,
  onReset,
  isMobile = false,
  onClose,
}) {
  /* location cascades */
  const [states, setStates]   = useState([]);
  const [cities, setCities]   = useState([]);
  const [areas,  setAreas]    = useState([]);

  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [areasLoading,  setAreasLoading]  = useState(false);

  /* collapsed sections */
  const [collapsed, setCollapsed] = useState({
    sort: false, price: false, location: false, custom: true,
  });
  const toggle = key => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  /* ── helper: safely extract array from various API response shapes ──
     Handles: json.data (array), json.data.data (paginated), json (array) */
  const extractArray = (json) => {
    if (!json || json.error) return [];
    if (Array.isArray(json.data))            return json.data;
    if (Array.isArray(json.data?.data))      return json.data.data;
    if (Array.isArray(json))                 return json;
    return [];
  };

  /* ── fetch states on mount ── */
  useEffect(() => {
    setStatesLoading(true);
    fetch(`${API_BASE}/states`)
      .then(r => r.json())
      .then(json => setStates(extractArray(json)))
      .catch(console.error)
      .finally(() => setStatesLoading(false));
  }, []);

  /* ── fetch cities when state changes ── */
  useEffect(() => {
    if (!filters.state_id) { setCities([]); onChange({ city_id: "", area_id: "" }); return; }
    setCitiesLoading(true);
    fetch(`${API_BASE}/cities?state_id=${filters.state_id}`)
      .then(r => r.json())
      .then(json => setCities(extractArray(json)))
      .catch(console.error)
      .finally(() => setCitiesLoading(false));
    // eslint-disable-next-line
  }, [filters.state_id]);

  /* ── fetch areas when city changes ── */
  useEffect(() => {
    if (!filters.city_id) { setAreas([]); onChange({ area_id: "" }); return; }
    setAreasLoading(true);
    fetch(`${API_BASE}/areas?city_id=${filters.city_id}`)
      .then(r => r.json())
      .then(json => setAreas(extractArray(json)))
      .catch(console.error)
      .finally(() => setAreasLoading(false));
    // eslint-disable-next-line
  }, [filters.city_id]);

  const activeCount = [
    filters.min_price, filters.max_price,
    filters.state_id,  filters.city_id,
    filters.area_id,   filters.search,
  ].filter(Boolean).length;

  /* ── accent helpers ── */
  const accentStyle = { color: meta.color };
  const activePill  = { backgroundColor: meta.color, color: "#fff", borderColor: meta.color };
  const inactivePill = { backgroundColor: "#fff", color: "#374151", borderColor: "#e5e7eb" };

  /* ── section header ── */
  const SectionHeader = ({ id, label, icon }) => (
    <button
      onClick={() => toggle(id)}
      className="w-full flex items-center justify-between py-3 group"
    >
      <div className="flex items-center gap-2">
        <i className={`fa-solid ${icon} text-xs`} style={accentStyle} />
        <span
          className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-800 transition-colors"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {label}
        </span>
      </div>
      <i
        className={`fa-solid fa-chevron-${collapsed[id] ? "down" : "up"} text-[9px] text-gray-400 transition-transform`}
      />
    </button>
  );

  return (
    <div
      className="bg-white dark:bg-[#061E29] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1D546D]/30"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1D546D]/20"
        style={{ backgroundColor: `${meta.color}08` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${meta.color}20` }}
          >
            <i className="fa-solid fa-sliders text-xs" style={accentStyle} />
          </div>
          <span
            className="font-black text-[13px] text-gray-800 dark:text-white"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Filters
          </span>
          {activeCount > 0 && (
            <span
              className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
              style={{ backgroundColor: meta.color }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Reset all
            </button>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#0d2f3f] flex items-center justify-center hover:bg-gray-200 transition-colors ml-1"
            >
              <i className="fa-solid fa-xmark text-xs text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 divide-y divide-gray-100 dark:divide-[#1D546D]/20">

        {/* ── Sort By ── */}
        <div>
          <SectionHeader id="sort" label="Sort By" icon="fa-arrow-down-wide-short" />
          {!collapsed.sort && (
            <div className="pb-4 space-y-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ sort_by: opt.value })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 border"
                  style={
                    filters.sort_by === opt.value
                      ? { ...activePill, boxShadow: `0 3px 10px ${meta.color}30` }
                      : { ...inactivePill, boxShadow: "none" }
                  }
                >
                  <i
                    className={`fa-solid ${opt.icon} text-[11px] w-4 text-center`}
                    style={filters.sort_by === opt.value ? { color: "#fff" } : accentStyle}
                  />
                  <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}>
                    {opt.label}
                  </span>
                  {filters.sort_by === opt.value && (
                    <i className="fa-solid fa-check text-[10px] ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Price Range ── */}
        <div>
          <SectionHeader id="price" label="Price Range" icon="fa-indian-rupee-sign" />
          {!collapsed.price && (
            <div className="pb-4 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={e => onChange({ min_price: e.target.value })}
                    className="w-full pl-7 pr-3 py-2.5 text-[13px] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl outline-none bg-white dark:bg-[#0d2f3f] text-gray-800 dark:text-white transition-colors"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                    onFocus={e => { e.target.style.borderColor = meta.color; e.target.style.boxShadow = `0 0 0 3px ${meta.color}15`; }}
                    onBlur={e => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }}
                  />
                </div>
                <div className="flex items-center text-gray-300 font-bold text-xs">—</div>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={e => onChange({ max_price: e.target.value })}
                    className="w-full pl-7 pr-3 py-2.5 text-[13px] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl outline-none bg-white dark:bg-[#0d2f3f] text-gray-800 dark:text-white transition-colors"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                    onFocus={e => { e.target.style.borderColor = meta.color; e.target.style.boxShadow = `0 0 0 3px ${meta.color}15`; }}
                    onBlur={e => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }}
                  />
                </div>
              </div>
              {/* Quick price chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Under ₹10K",  min: "",      max: "10000"  },
                  { label: "₹10K–50K",    min: "10000", max: "50000"  },
                  { label: "₹50K–1L",     min: "50000", max: "100000" },
                  { label: "Above ₹1L",   min: "100000",max: ""       },
                ].map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => onChange({ min_price: chip.min, max_price: chip.max })}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all"
                    style={
                      filters.min_price === chip.min && filters.max_price === chip.max
                        ? { backgroundColor: meta.color, color: "#fff", borderColor: meta.color }
                        : { backgroundColor: `${meta.color}08`, color: meta.color, borderColor: `${meta.color}30` }
                    }
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Location ── */}
        <div>
          <SectionHeader id="location" label="Location" icon="fa-location-dot" />
          {!collapsed.location && (
            <div className="pb-4 space-y-2.5">
              {/* State */}
              <SelectField
                label="State"
                value={filters.state_id}
                loading={statesLoading}
                placeholder="All States"
                options={states.map(s => ({ value: s.id, label: s.name }))}
                onChange={v => onChange({ state_id: v, city_id: "", area_id: "" })}
                meta={meta}
              />
              {/* City */}
              <SelectField
                label="City"
                value={filters.city_id}
                loading={citiesLoading}
                placeholder={filters.state_id ? "All Cities" : "Select state first"}
                disabled={!filters.state_id}
                options={cities.map(c => ({ value: c.id, label: c.name }))}
                onChange={v => onChange({ city_id: v, area_id: "" })}
                meta={meta}
              />
              {/* Area */}
              <SelectField
                label="Area"
                value={filters.area_id}
                loading={areasLoading}
                placeholder={filters.city_id ? "All Areas" : "Select city first"}
                disabled={!filters.city_id}
                options={areas.map(a => ({ value: a.id, label: a.name }))}
                onChange={v => onChange({ area_id: v })}
                meta={meta}
              />
            </div>
          )}
        </div>

        {/* ── Custom Fields (dynamic per category) ── */}
        {customFields.length > 0 && (
          <div>
            <SectionHeader id="custom" label="More Filters" icon="fa-filter" />
            {!collapsed.custom && (
              <div className="pb-4 space-y-3">
                {customFields.map(field => (
                  <CustomFieldInput
                    key={field.id}
                    field={field}
                    value={filters[`cf_${field.id}`] || ""}
                    onChange={v => onChange({ [`cf_${field.id}`]: v })}
                    meta={meta}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Keyword Search ── */}
        <div className="py-4">
          <label
            className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Keyword
          </label>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]" />
            <input
              type="text"
              placeholder="Search listings…"
              value={filters.search}
              onChange={e => onChange({ search: e.target.value })}
              onKeyDown={e => e.key === "Enter" && onApply()}
              className="w-full pl-8 pr-3 py-2.5 text-[13px] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl outline-none bg-white dark:bg-[#0d2f3f] text-gray-800 dark:text-white"
              style={{ fontFamily: "Manrope, sans-serif" }}
              onFocus={e => { e.target.style.borderColor = meta.color; e.target.style.boxShadow = `0 0 0 3px ${meta.color}15`; }}
              onBlur={e => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }}
            />
          </div>
        </div>
      </div>

      {/* ── Apply Button ── */}
      <div className="px-5 pb-5">
        <button
          onClick={onApply}
          className="w-full py-3 rounded-xl text-[13px] font-black text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            backgroundColor: meta.color,
            boxShadow: `0 4px 16px ${meta.color}45`,
            fontFamily: "Manrope, sans-serif",
          }}
        >
          <i className="fa-solid fa-magnifying-glass mr-2 text-[11px]" />
          Apply Filters
        </button>
      </div>
    </div>
  );
}

/* ── Helper: Select dropdown ── */
function SelectField({ label, value, loading, placeholder, disabled, options, onChange, meta }) {
  return (
    <div>
      <label
        className="block text-[11px] font-semibold text-gray-400 mb-1"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        {label}
      </label>
      <div className="relative">
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
          </div>
        )}
        <select
          value={value}
          disabled={disabled || loading}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2.5 text-[13px] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl outline-none appearance-none bg-white dark:bg-[#0d2f3f] text-gray-700 dark:text-gray-200 disabled:opacity-40 cursor-pointer pr-8"
          style={{ fontFamily: "Manrope, sans-serif" }}
          onFocus={e => { e.target.style.borderColor = meta.color; }}
          onBlur={e => { e.target.style.borderColor = ""; }}
        >
          <option value="">{placeholder}</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down text-[9px] text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

/* ── Helper: Dynamic custom field renderer ── */
function CustomFieldInput({ field, value, onChange, meta }) {
  const baseInput = "w-full px-3 py-2.5 text-[13px] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl outline-none bg-white dark:bg-[#0d2f3f] text-gray-800 dark:text-white";

  const focusHandlers = {
    onFocus: e => { e.target.style.borderColor = meta.color; e.target.style.boxShadow = `0 0 0 3px ${meta.color}15`; },
    onBlur:  e => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; },
  };

  return (
    <div>
      <label
        className="block text-[11px] font-semibold text-gray-400 mb-1"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        {field.name}
      </label>

      {field.type === "select" || field.type === "radio" ? (
        <div className="relative">
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`${baseInput} appearance-none pr-8 cursor-pointer`}
            style={{ fontFamily: "Manrope, sans-serif" }}
            {...focusHandlers}
          >
            <option value="">Any</option>
            {(field.options || []).map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down text-[9px] text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      ) : field.type === "checkbox" ? (
        <div className="flex flex-wrap gap-1.5">
          {(field.options || []).map((opt, i) => (
            <button
              key={i}
              onClick={() => onChange(value === opt ? "" : opt)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all"
              style={
                value === opt
                  ? { backgroundColor: meta.color, color: "#fff", borderColor: meta.color }
                  : { backgroundColor: `${meta.color}08`, color: meta.color, borderColor: `${meta.color}30` }
              }
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <input
          type={field.type === "number" ? "number" : "text"}
          placeholder={field.placeholder || `Enter ${field.name}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={baseInput}
          style={{ fontFamily: "Manrope, sans-serif" }}
          {...focusHandlers}
        />
      )}
    </div>
  );
}