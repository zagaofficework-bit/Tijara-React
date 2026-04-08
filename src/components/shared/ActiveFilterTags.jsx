const LABELS = {
  keyword: "Keyword",
  category_id: "Category",
  min_price: "Min price",
  max_price: "Max price",
  city: "City",
  state: "State",
};

export default function ActiveFilterTags({ appliedFilters, onUpdate, onApply }) {
  const active = Object.entries(appliedFilters).filter(
    ([k, v]) => v && k !== "sort_by"
  );

  if (!active.length) return null;

  const remove = (key) => {
    onUpdate(key, "");
    onApply();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
      {active.map(([key, val]) => (
        <span
          key={key}
          className="flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold bg-[#1D546D]/10 dark:bg-[#1D546D]/20 text-[#1D546D] dark:text-[#5F9598] rounded-full"
        >
          {LABELS[key] || key}: {val}
          <button
            onClick={() => remove(key)}
            className="hover:text-[#061E29] dark:hover:text-white"
          >
            <i className="fa-solid fa-xmark text-[10px]" />
          </button>
        </span>
      ))}
    </div>
  );
}