export default function Pagination({ current, total, onPageChange }) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const visible = pages.filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 1
  );

  const withEllipsis = [];
  let prev = null;
  for (const p of visible) {
    if (prev !== null && p - prev > 1) {
      withEllipsis.push("...");
    }
    withEllipsis.push(p);
    prev = p;
  }

  const btnBase =
    "min-w-[36px] h-9 px-3 text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center";

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8 flex-wrap" style={{ fontFamily: "Manrope, sans-serif" }}>
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className={`${btnBase} border border-gray-200 dark:border-[#1D546D]/40 text-gray-500 dark:text-gray-400 hover:border-[#1D546D] hover:text-[#1D546D] disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <i className="fa-solid fa-chevron-left text-[11px]" />
      </button>

      {withEllipsis.map((item, i) =>
        item === "..." ? (
          <span key={`e-${i}`} className="text-gray-400 px-1">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`${btnBase} ${
              item === current
                ? "bg-[#1D546D] text-white border border-[#1D546D]"
                : "border border-gray-200 dark:border-[#1D546D]/40 text-gray-600 dark:text-gray-300 hover:border-[#1D546D] hover:text-[#1D546D]"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className={`${btnBase} border border-gray-200 dark:border-[#1D546D]/40 text-gray-500 dark:text-gray-400 hover:border-[#1D546D] hover:text-[#1D546D] disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <i className="fa-solid fa-chevron-right text-[11px]" />
      </button>
    </div>
  );
}