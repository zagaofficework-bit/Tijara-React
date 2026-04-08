const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function FilterSidebar({
  filters,
  categories,
  onUpdate,
  onApply,
  onReset,
  onClose,
  isMobile = false,
}) {
  const inputClass =
    "w-full px-3 py-2 text-[13px] bg-[#F3F4F4] dark:bg-[#0d2f3f] border border-gray-200 dark:border-[#1D546D]/50 rounded-lg text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-[#1D546D] focus:ring-1 focus:ring-[#1D546D]/20 transition-all";
  const labelClass =
    "block text-[12px] font-semibold text-[#061E29] dark:text-[#5F9598] uppercase tracking-wide mb-1.5";

  return (
    <div
      className={`flex flex-col gap-5 ${
        isMobile ? "p-5" : "p-5 bg-white dark:bg-[#061E29] rounded-2xl border border-gray-100 dark:border-[#1D546D]/30 sticky top-24"
      }`}
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-sliders text-[#1D546D] text-[14px]" />
          <h2 className="text-[15px] font-bold text-[#061E29] dark:text-white">Filters</h2>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D546D]/20 text-gray-500 dark:text-gray-400"
          >
            <i className="fa-solid fa-xmark text-[16px]" />
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className={labelClass}>Sort by</label>
        <select
          value={filters.sort_by}
          onChange={(e) => onUpdate("sort_by", e.target.value)}
          className={inputClass}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Keyword */}
      <div>
        <label className={labelClass}>Search keyword</label>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[12px]" />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => onUpdate("keyword", e.target.value)}
            placeholder="e.g. car, laptop..."
            className={`${inputClass} pl-8`}
          />
        </div>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={filters.category_id}
            onChange={(e) => onUpdate("category_id", e.target.value)}
            className={inputClass}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range */}
      <div>
        <label className={labelClass}>Price range (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.min_price}
            onChange={(e) => onUpdate("min_price", e.target.value)}
            placeholder="Min"
            min="0"
            className={inputClass}
          />
          <span className="text-gray-400 text-[12px] shrink-0">to</span>
          <input
            type="number"
            value={filters.max_price}
            onChange={(e) => onUpdate("max_price", e.target.value)}
            placeholder="Max"
            min="0"
            className={inputClass}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>City</label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => onUpdate("city", e.target.value)}
          placeholder="e.g. Mumbai"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>State</label>
        <input
          type="text"
          value={filters.state}
          onChange={(e) => onUpdate("state", e.target.value)}
          placeholder="e.g. Maharashtra"
          className={inputClass}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-[#1D546D]/20" />

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => { onApply(); if (isMobile) onClose?.(); }}
          className="w-full py-2.5 text-[13px] font-bold bg-[#1D546D] text-white rounded-xl hover:bg-[#061E29] transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={onReset}
          className="w-full py-2.5 text-[13px] font-semibold text-[#1D546D] dark:text-[#5F9598] border border-[#1D546D]/40 dark:border-[#5F9598]/30 rounded-xl hover:bg-[#1D546D]/5 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}