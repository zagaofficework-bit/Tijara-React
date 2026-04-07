// src/components/home/ProductCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ProductCard
 * Props: id, image, title, price, location, onAddToCart(id)
 */
export default function ProductCard({ id, image, title, price, location, onAddToCart }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleCart = (e) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart?.(id);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => navigate(`/listing/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/listing/${id}`)}
      className="bg-surface-container-lowest rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    >
      {/* Image */}
      <div className="relative h-48 sm:h-60 md:h-72 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); }}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <span
            className="material-symbols-outlined text-lg transition-colors"
            style={{
              fontVariationSettings: liked ? <i class="fa-solid fa-heart"></i> : <i class="fa-regular fa-heart"></i>,
              color: liked ? "#ba1a1a" : "#73787b",
            }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <h3 className="font-headline font-bold text-base md:text-xl group-hover:text-secondary transition-colors line-clamp-2 flex-1">
            {title}
          </h3>
          <span className="font-headline font-extrabold text-base md:text-xl text-primary whitespace-nowrap">
            {price}
          </span>
        </div>

        <div className="flex items-center gap-1 text-on-surface-variant text-xs md:text-sm mb-4 md:mb-6">
          <span className="material-symbols-outlined text-sm"><i class="fa-solid fa-location-dot"></i></span>
          {location}
        </div>

        <button
          onClick={handleCart}
          className={`w-full py-2.5 md:py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-xs md:text-sm ${added
              ? "bg-white text-green-600"
              : "bg-white text-black hover:bg-white"
            }`}
        >
          {added ? <i class="fa-regular fa-circle-check"></i> : <i class="fa-solid fa-cart-arrow-down"></i>}

          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}