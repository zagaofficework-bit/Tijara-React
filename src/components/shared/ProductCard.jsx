// src/components/home/ProductCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ProductCard
 * Props:
 *   id        – listing id (for navigation)
 *   image     – image URL
 *   title     – product name
 *   price     – formatted price string e.g. "$299.00"
 *   location  – seller location string
 *   onAddToCart(id) – callback
 */
export default function ProductCard({ id, image, title, price, location, onAddToCart }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAddedToCart(true);
    onAddToCart?.(id);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <div
      onClick={() => navigate(`/listing/${id}`)}
      className="bg-surface-container-lowest rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/listing/${id}`)}
    >
      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); }}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <span
            className="material-symbols-outlined transition-colors"
            style={{
              fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0",
              color: liked ? "#ba1a1a" : "#73787b",
            }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline font-bold text-xl group-hover:text-secondary transition-colors line-clamp-1 flex-1 mr-2">
            {title}
          </h3>
          <span className="font-headline font-extrabold text-xl text-primary whitespace-nowrap">
            {price}
          </span>
        </div>

        <div className="flex items-center gap-1 text-on-surface-variant text-sm mb-6">
          <span className="material-symbols-outlined text-sm">location_on</span>
          {location}
        </div>

        <button
          onClick={handleAddToCart}
          className={`w-full py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm ${
            addedToCart
              ? "bg-secondary text-white"
              : "bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {addedToCart ? "check" : "shopping_cart"}
          </span>
          {addedToCart ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}