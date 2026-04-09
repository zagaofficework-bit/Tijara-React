// src/components/category/ItemCard.jsx
// Props: item (object), meta (category color/icon meta)

import { Link } from "react-router-dom";

const FALLBACK_IMG = "https://placehold.co/400x300?text=No+Image";

export default function ItemCard({ item, meta }) {
  const {
    id,
    name,
    price,
    image,
    city,
    state,
    category,
    show_only_to_premium,
    is_feature,
    user,
    clicks,
    total_likes,
    is_liked,
    created_at,
  } = item;

  /* ── Helpers ── */
  const formattedPrice = price
    ? `₹${Number(price).toLocaleString("en-IN")}`
    : "Price on request";

  const location = [city, state].filter(Boolean).join(", ");

  const sellerInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const timeAgo = created_at
    ? getTimeAgo(created_at)
    : null;

  /* ── accent from meta (fallback to brand teal) ── */
  const accentColor = meta?.color || "#1D546D";
  const accentBg    = meta?.bg    || "#ecfeff";

  return (
    <Link
      to={`/item/${id}`}
      className="group block bg-white dark:bg-[#061E29] border border-gray-100 dark:border-[#1D546D]/30 rounded-2xl overflow-hidden transition-all duration-200"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.12), 0 0 0 1.5px ${accentColor}45`;
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "4/3", backgroundColor: accentBg }}
      >
        <img
          src={image || FALLBACK_IMG}
          alt={name}
          loading="lazy"
          onError={e => { e.target.src = FALLBACK_IMG; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}18` }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            <i className="fa-solid fa-arrow-right text-white text-sm" />
          </div>
        </div>

        {/* ── Badges top-left ── */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {is_feature === 1 && (
            <span
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black text-white rounded-lg shadow-sm"
              style={{ backgroundColor: accentColor, fontFamily: "Manrope, sans-serif" }}
            >
              <i className="fa-solid fa-bolt text-[8px]" />
              Featured
            </span>
          )}
          {show_only_to_premium === 1 && (
            <span
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black text-white rounded-lg bg-amber-500 shadow-sm"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              <i className="fa-solid fa-crown text-[8px]" />
              Premium
            </span>
          )}
        </div>

        {/* ── Like button top-right ── */}
        <button
          onClick={e => e.preventDefault()}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 ${
            is_liked
              ? "bg-red-500 text-white shadow-red-200"
              : "bg-white/85 dark:bg-[#061E29]/85 text-gray-500 dark:text-gray-300 hover:bg-white"
          }`}
          aria-label={is_liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <i className={`fa-${is_liked ? "solid" : "regular"} fa-heart text-[12px]`} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="p-4">

        {/* Category label */}
        {category?.name && (
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-1.5"
            style={{ color: accentColor, fontFamily: "Manrope, sans-serif" }}
          >
            {category.name}
          </p>
        )}

        {/* Name */}
        <h3
          className="text-[14px] font-bold text-[#061E29] dark:text-white line-clamp-2 mb-1.5 leading-snug transition-colors"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {name}
        </h3>

        {/* Price + Time */}
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-[16px] font-black"
            style={{ color: accentColor, fontFamily: "Manrope, sans-serif" }}
          >
            {formattedPrice}
          </p>
          {timeAgo && (
            <span
              className="text-[10px] text-gray-400"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {timeAgo}
            </span>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-3">
            <i className="fa-solid fa-location-dot text-[10px]" style={{ color: accentColor }} />
            <span
              className="text-[12px] truncate"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {location}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#1D546D]/20">

          {/* Seller avatar + name */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`, fontFamily: "Manrope, sans-serif" }}
            >
              {sellerInitials}
            </div>
            <span
              className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[80px]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {user?.name || "Seller"}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 shrink-0">
            <span className="flex items-center gap-1 text-[11px]">
              <i className="fa-regular fa-eye text-[10px]" />
              <span style={{ fontFamily: "Manrope, sans-serif" }}>{formatCount(clicks)}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <i className="fa-regular fa-heart text-[10px]" />
              <span style={{ fontFamily: "Manrope, sans-serif" }}>{formatCount(total_likes)}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Utility: time ago ── */
function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years  = Math.floor(days / 365);
  if (mins < 1)    return "Just now";
  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days < 30)   return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/* ── Utility: compact number ── */
function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}