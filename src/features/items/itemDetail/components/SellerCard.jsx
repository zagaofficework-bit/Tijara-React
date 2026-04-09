import { useNavigate } from "react-router-dom";

export default function SellerCard({ user, contact, showContact }) {
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const handleCall = () => {
    if (contact) window.location.href = `tel:${contact}`;
  };

  const handleChat = () => {
    navigate("/chat", {
      state: { sellerId: user?.id, sellerName: user?.name },
    });
  };

  return (
    <div
      className="bg-white dark:bg-[#061E29] border border-gray-100 dark:border-[#1D546D]/30 rounded-2xl p-5"
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      <p className="text-[11px] font-bold text-[#5F9598] uppercase tracking-wide mb-3">Seller</p>

      {/* Seller info */}
      <div className="flex items-center gap-3 mb-4">
        {user?.profile ? (
          <img
            src={user.profile}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#1D546D]/20"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#1D546D] flex items-center justify-center text-white text-[14px] font-black shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[14px] font-black text-[#061E29] dark:text-white truncate">{user?.name || "Unknown"}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {user?.is_verified ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <i className="fa-solid fa-circle-check text-[10px]" /> Verified
              </span>
            ) : (
              <span className="text-[11px] text-gray-400 dark:text-gray-500">Not verified</span>
            )}
          </div>
        </div>
      </div>

      {/* Rating if available */}
      {user?.average_rating && (
        <div className="flex items-center gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <i
              key={s}
              className={`fa-${s <= Math.round(user.average_rating) ? "solid" : "regular"} fa-star text-[12px] text-amber-400`}
            />
          ))}
          <span className="text-[12px] text-gray-500 dark:text-gray-400 ml-1">
            {Number(user.average_rating).toFixed(1)} ({user.reviews_count} reviews)
          </span>
        </div>
      )}

      {/* Member since */}
      {user?.created_at && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">
          Member since{" "}
          {new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      )}

      <div className="border-t border-gray-100 dark:border-[#1D546D]/20 pt-4 flex flex-col gap-2.5">
        {/* Chat */}
        <button
          onClick={handleChat}
          className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-black bg-[#1D546D] text-white rounded-xl hover:bg-[#061E29] transition-colors"
        >
          <i className="fa-solid fa-comment-dots text-[15px]" />
          Start Chat
        </button>

        {/* Call */}
        {showContact && contact && (
          <button
            onClick={handleCall}
            className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-black text-[#1D546D] dark:text-[#5F9598] border-2 border-[#1D546D]/30 dark:border-[#5F9598]/30 rounded-xl hover:bg-[#1D546D]/5 transition-colors"
          >
            <i className="fa-solid fa-phone text-[14px]" />
            Call Seller
          </button>
        )}
      </div>
    </div>
  );
}