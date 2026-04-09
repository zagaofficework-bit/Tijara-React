import { useState } from "react";
import { useItems } from "../services/useItems";
import FilterSidebar from "../../../components/shared/FilterSidebar";
import ItemsGrid from "../components/ItemsGrid";
import Pagination from "../../../components/shared/Pagination";
import ActiveFilterTags from "../../../components/shared/ActiveFilterTags";

export default function ItemsPage() {
  const {
    items,
    categories,
    filters,
    appliedFilters,
    pagination,
    loading,
    error,
    updateFilter,
    applyFilters,
    resetFilters,
    goToPage,
  } = useItems();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFilterCount = Object.entries(appliedFilters).filter(
    ([k, v]) => v && k !== "sort_by"
  ).length;

  return (
    <div className="min-h-screen bg-[#F3F4F4] dark:bg-[#040F14] pt-[72px] sm:pt-[80px]">

      {/* ── Page Header ── */}
      <div className="bg-[#061E29] px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto">
          <h1
            className="text-[22px] sm:text-[28px] font-black text-white mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Browse Listings
          </h1>
          <p
            className="text-[13px] text-[#5F9598]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {loading
              ? "Loading..."
              : `${pagination.total.toLocaleString()} item${pagination.total !== 1 ? "s" : ""} found`}
          </p>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex gap-6">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <FilterSidebar
              filters={filters}
              categories={categories}
              onUpdate={updateFilter}
              onApply={applyFilters}
              onReset={resetFilters}
            />
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 text-[13px] font-semibold bg-white dark:bg-[#061E29] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl text-[#061E29] dark:text-white hover:border-[#1D546D] transition-colors"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                <i className="fa-solid fa-sliders text-[#1D546D] text-[14px]" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#1D546D] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort — mobile shortcut */}
              <div className="flex items-center gap-2 ml-auto lg:hidden">
                <select
                  value={filters.sort_by}
                  onChange={(e) => { updateFilter("sort_by", e.target.value); applyFilters(); }}
                  className="text-[12px] font-semibold bg-white dark:bg-[#061E29] border border-gray-200 dark:border-[#1D546D]/40 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-200 outline-none"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  <option value="latest">Latest</option>
                  <option value="price_low">Price ↑</option>
                  <option value="price_high">Price ↓</option>
                  <option value="popular">Popular</option>
                </select>
              </div>

              {/* Result count desktop */}
              <p className="hidden lg:block text-[13px] text-gray-500 dark:text-gray-400" style={{ fontFamily: "Manrope, sans-serif" }}>
                Showing page {pagination.current_page} of {pagination.last_page}
              </p>
            </div>

            {/* Active filter tags */}
            <ActiveFilterTags
              appliedFilters={appliedFilters}
              onUpdate={updateFilter}
              onApply={applyFilters}
            />

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl">
                <i className="fa-solid fa-circle-exclamation text-red-500 text-[16px]" />
                <p className="text-[13px] text-red-600 dark:text-red-400" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {error}. Please try again.
                </p>
                <button
                  onClick={applyFilters}
                  className="ml-auto text-[12px] font-semibold text-red-600 dark:text-red-400 hover:underline"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Grid */}
            <ItemsGrid items={items} loading={loading} />

            {/* Pagination */}
            <Pagination
              current={pagination.current_page}
              total={pagination.last_page}
              onPageChange={goToPage}
            />
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div
            className="absolute right-0 top-0 h-full w-[320px] max-w-[92vw] bg-white dark:bg-[#061E29] overflow-y-auto"
            style={{ animation: "slideFromRight 0.22s ease" }}
          >
            <FilterSidebar
              filters={filters}
              categories={categories}
              onUpdate={updateFilter}
              onApply={applyFilters}
              onReset={resetFilters}
              onClose={() => setMobileFilterOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}