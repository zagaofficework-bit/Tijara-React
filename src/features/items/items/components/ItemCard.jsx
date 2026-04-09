import { Link } from "react-router-dom";

const FALLBACK_IMG = "https://via.placeholder.com/400x280?text=No+Image";

export default function ItemCard({ item }) {
  const {
    id,
    name,
    price,
    image,
    //address,
    city,
    state,
    category,
    show_only_to_premium,
    is_feature,
    user,
    //expiry_date,
    clicks,
    total_likes,
    is_liked,
    //status,
  } = item;

  const formattedPrice = price
    ? `₹${Number(price).toLocaleString("en-IN")}`
    : "Price on request";

  const location = [city, state].filter(Boolean).join(", ");
  const sellerInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <Link
      to={`/item/${id}`}
      className="group block bg-white dark:bg-[#061E29] border border-gray-100 dark:border-[#1D546D]/30 rounded-2xl overflow-hidden hover:border-[#1D546D] dark:hover:border-[#5F9598] transition-all duration-200"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F3F4F4] dark:bg-[#0d2f3f]" style={{ aspectRatio: "4/3" }}>
        <img
          src={image || FALLBACK_IMG}
          alt={name}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {is_feature && (
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#061E29] text-white rounded-md" style={{ fontFamily: "Manrope, sans-serif" }}>
              Featured
            </span>
          )}
          {show_only_to_premium === 1 && (
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#1D546D] text-white rounded-md" style={{ fontFamily: "Manrope, sans-serif" }}>
              Premium
            </span>
          )}
        </div>

        {/* Like */}
        <button
          onClick={(e) => { e.preventDefault(); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            is_liked
              ? "bg-red-500 text-white"
              : "bg-white/80 dark:bg-[#061E29]/80 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#061E29]"
          }`}
        >
          <i className={`fa-${is_liked ? "solid" : "regular"} fa-heart text-[13px]`} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category */}
        {category?.name && (
          <p className="text-[11px] font-semibold text-[#5F9598] uppercase tracking-wide mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>
            {category.name}
          </p>
        )}

        {/* Name */}
        <h3
          className="text-[14px] font-bold text-[#061E29] dark:text-white line-clamp-1 mb-1 group-hover:text-[#1D546D] dark:group-hover:text-[#5F9598] transition-colors"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {name}
        </h3>

        {/* Price */}
        <p className="text-[16px] font-black text-[#1D546D] dark:text-[#5F9598] mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
          {formattedPrice}
        </p>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-3">
            <i className="fa-solid fa-location-dot text-[11px] text-[#5F9598]" />
            <span className="text-[12px] truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{location}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#1D546D]/20">
          {/* Seller */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: "#1D546D", fontFamily: "Manrope, sans-serif" }}
            >
              {sellerInitials}
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[80px]" style={{ fontFamily: "Manrope, sans-serif" }}>
              {user?.name || "Seller"}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1 text-[11px]">
              <i className="fa-regular fa-eye text-[11px]" />
              {clicks || 0}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <i className="fa-regular fa-heart text-[11px]" />
              {total_likes || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}