import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MakeOfferModal({ item, onClose }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const listedPrice = item?.price || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    // Redirect to chat with offer details as state
    navigate("/chat", {
      state: {
        itemId: item.id,
        itemName: item.name,
        itemImage: item.image,
        sellerId: item.user_id,
        sellerName: item.user?.name,
        offerAmount: num,
        listedPrice,
        initialMessage: `Hi, I'd like to make an offer of ₹${Number(num).toLocaleString("en-IN")} for your listing "${item.name}" (listed at ₹${Number(listedPrice).toLocaleString("en-IN")}).`,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(6,30,41,0.55)" }}
    >
      <div
        className="bg-white dark:bg-[#061E29] w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1D546D]/30">
          <div>
            <h2 className="text-[16px] font-black text-[#061E29] dark:text-white">Make an Offer</h2>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
              Listed at{" "}
              <span className="font-bold text-[#1D546D] dark:text-[#5F9598]">
                ₹{Number(listedPrice).toLocaleString("en-IN")}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#1D546D]/20 text-gray-500 dark:text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        {/* Item preview */}
        <div className="flex items-center gap-3 px-5 py-4 bg-[#F3F4F4] dark:bg-[#0d2f3f]">
          <img
            src={item?.image}
            alt={item?.name}
            onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
            className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-[#1D546D]/30"
          />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#061E29] dark:text-white truncate">{item?.name}</p>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              {[item?.city, item?.state].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-5">
          <label className="block text-[12px] font-bold text-[#061E29] dark:text-[#5F9598] uppercase tracking-wide mb-2">
            Your Offer Amount (₹)
          </label>
          <div className="relative mb-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#1D546D] dark:text-[#5F9598]">₹</span>
            <input
              autoFocus
              type="number"
              min="1"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              placeholder={`e.g. ${Math.round(listedPrice * 0.9).toLocaleString("en-IN")}`}
              className="w-full pl-8 pr-4 py-3.5 text-[15px] font-bold bg-[#F3F4F4] dark:bg-[#0d2f3f] border-2 border-gray-200 dark:border-[#1D546D]/40 rounded-xl text-[#061E29] dark:text-white outline-none focus:border-[#1D546D] transition-colors"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-500 mb-3">{error}</p>
          )}

          {amount && !error && Number(amount) < listedPrice && (
            <p className="text-[12px] text-[#5F9598] mb-3">
              Your offer is{" "}
              <span className="font-bold">
                {Math.round(((listedPrice - Number(amount)) / listedPrice) * 100)}% below
              </span>{" "}
              the listed price.
            </p>
          )}

          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">
            Submitting will open a chat with the seller with your offer pre-filled.
          </p>

          <button
            type="submit"
            className="w-full py-3.5 text-[14px] font-black bg-[#1D546D] text-white rounded-xl hover:bg-[#061E29] transition-colors"
          >
            Send Offer to Seller
          </button>
        </form>
      </div>
    </div>
  );
}