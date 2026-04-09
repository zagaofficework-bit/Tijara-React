// src/components/category/ItemsGrid.jsx
// Props: items, loading, meta (category accent meta)

import ItemCard from "./ItemCard";

export default function ItemsGrid({ items, loading, meta }) {
  /* ── Loading skeletons ── */
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  /* ── Empty state ── */
  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
          style={{
            backgroundColor: meta?.bg || "#f3f4f6",
            boxShadow: `0 8px 24px ${meta?.color || "#6b7280"}20`,
          }}
        >
          <i
            className={`fa-solid ${meta?.icon || "fa-box-open"} text-[32px] opacity-40`}
            style={{ color: meta?.color || "#6b7280" }}
          />
        </div>
        <h3
          className="text-[16px] font-bold text-[#061E29] dark:text-white mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          No listings found
        </h3>
        <p
          className="text-[13px] text-gray-400 dark:text-gray-500 max-w-[240px] leading-relaxed"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Try adjusting your filters or check back later for new listings.
        </p>
      </div>
    );
  }

  /* ── Grid ── */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {items.map(item => (
        <ItemCard key={item.id} item={item} meta={meta} />
      ))}
    </div>
  );
}

/* ── Skeleton placeholder card ── */
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#061E29] border border-gray-100 dark:border-[#1D546D]/30 rounded-2xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div
        className="bg-[#F3F4F4] dark:bg-[#0d2f3f]"
        style={{ aspectRatio: "4/3" }}
      />
      {/* Content placeholder */}
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 w-1/4 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded-full" />
        <div className="h-4 w-4/5 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded-lg" />
        <div className="h-3.5 w-3/5 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded-lg" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-1/3 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded-lg" />
          <div className="h-3 w-1/5 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
        </div>
        <div className="h-3 w-2/5 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
        <div className="pt-2 flex items-center justify-between border-t border-[#F3F4F4] dark:border-[#0d2f3f]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#F3F4F4] dark:bg-[#0d2f3f]" />
            <div className="h-3 w-16 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
          </div>
          <div className="h-3 w-12 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
        </div>
      </div>
    </div>
  );
}