import ItemCard from "./ItemCard";

export default function ItemsGrid({ items, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F3F4F4] dark:bg-[#0d2f3f] flex items-center justify-center mb-4">
          <i className="fa-solid fa-box-open text-[32px] text-[#5F9598]" />
        </div>
        <h3 className="text-[16px] font-bold text-[#061E29] dark:text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
          No items found
        </h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-[260px]" style={{ fontFamily: "Manrope, sans-serif" }}>
          Try adjusting your filters or search with different keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#061E29] border border-gray-100 dark:border-[#1D546D]/30 rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-[#F3F4F4] dark:bg-[#0d2f3f]" style={{ aspectRatio: "4/3" }} />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-1/3 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
        <div className="h-4 w-3/4 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
        <div className="h-5 w-1/2 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
        <div className="h-3 w-2/3 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
        <div className="pt-2 flex justify-between">
          <div className="h-7 w-24 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded-full" />
          <div className="h-5 w-16 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded" />
        </div>
      </div>
    </div>
  );
}