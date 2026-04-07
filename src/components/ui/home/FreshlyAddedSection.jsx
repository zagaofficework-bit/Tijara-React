// src/components/home/FreshlyAddedSection.jsx
import { useState, useEffect, useRef } from "react";
import ProductCard from "../../shared/ProductCard";

// Fallback seed data shown while API loads or if it fails
const SEED_PRODUCTS = [
  {
    id: "seed-1",
    title: "Ultra-light Athletic Pro",
    price: "$299.00",
    location: "Brooklyn, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCojrwlCeSkGNe0oBvQePqQdGMQG_LCq7Y-7K_zTHDVReh9p-RrsraZzXVOtQHqStR8M7tWyE0in2mAysRDEkeHvUQ5o-Ji1Igr1hpm33AvUPwL3N4eolFt3F4iU1z7-5KCb2nWbACq7X96m4RZbYJmOomFQWBd79zAg_esNcp0V3cZMG0UpH8jgjOC7S1Y9k5VEkX7R7P3yQmP3Z3gxiF2h8dOYb9TxoctGNlNz9P5VHalPa_37iosaGY5OMaKT4aiFWdYow6p3b8",
  },
  {
    id: "seed-2",
    title: "Heritage Chronograph",
    price: "$1,250.00",
    location: "Manhattan, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCs6h_P0FB-aNz6OLL2HnT8BGT_j1uw7y37_m3TCyMUsFwOlg51ZMN_nQ7_RqgPZLdrJLKYLddXrTgcNHkxlsT12fqhDE-TviIUqB0mzvr5aWCgIXkfKGylh3Aromj_XkZlOGC2radeWHlvDC7ICJ6CRpOyctL5ydsl3xYC57K9jDXLjP3N4UdK4OjikZYbObybc02j0IWQl25hXxo7idBNzhW3K6CZ4qisF10NWbe4thtMOOFXdtfntoGFJIRyYb5G7v6hpTRTJUc",
  },
  {
    id: "seed-3",
    title: "Noise-Cancelling Solo",
    price: "$450.00",
    location: "Queens, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMumNjAmcRv4HQgGAqXjw85acONX_67oHdgifGcNw3LoRhOC__pO3c3FbZ01PZFwNod3I9b64c01T8AzHXQOz8Yyd174BVV86EqZLFDV_gVSjLGwlanaMcgeFaCfk15qoKHYafyy9HHP7IUlh7Mjjcl1Vm_Et0tLKMjJsZbTZra4tuxL-GH4qr_x6Kx9GukohrnrKl7UFLItywHg4X6p6qrg9I9dvZGCNNx-5x9S8iaDwOvpF5Y5LPntetywyavDbhDYdQs0f1WQA",
  },
  {
    id: "seed-4",
    title: "Aerowalk X Gen",
    price: "$180.00",
    location: "Jersey City, NJ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCq_6ViovXiETvcAgpwwgfGH15OY3GyrvrNpsyvPGK8TCD-pZ3xGaer0AR9S4MgKyZzOJJnJKQ-qVW2_RegNS3dOlPewH4RW3sucnxQVaBRskZBkOqw3gi_Jnr0YO9wUacm438BroQoX2NF4Z4qUayDE3-uPRHVOsw8djihfNwbTbbhbm42O4q66wJEmW3dvnF6ZQ3O48Bhfsd5r4RxaPHvb2DY8W5pzS1xcIkrpJenO6m9hOEJUM8NOH72on3QClLI_nE2AKAVsVQ",
  },
];

/**
 * Normalise a listing from GET /api/get-user-info or any listings endpoint
 * to the shape ProductCard expects.
 * Adjust field names to match your actual API response.
 */
function normaliseListing(item) {
  return {
    id: item._id || item.id,
    title: item.title || item.name,
    price: item.price
      ? `$${Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : "—",
    location: item.location || item.city || "Unknown",
    image: item.image || item.thumbnail || item.images?.[0] || "",
  };
}

export default function FreshlyAddedSection() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  /* ── Fetch freshly added listings ── */
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        /**
         * Replace with your actual listings endpoint.
         * GET /api/listings?sort=newest&limit=8
         * or whichever endpoint returns recent listings.
         *
         * If your only public endpoint is GET /api/get-user-info, skip the fetch
         * and keep SEED_PRODUCTS as the default until a listings API is ready.
         */
        const res = await fetch("/api/listings?sort=newest&limit=8", {
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data)
            ? data
            : data.listings ?? data.data ?? [];
          if (items.length) setProducts(items.map(normaliseListing));
        }
      } catch (err) {
        if (err.name !== "AbortError") console.warn("Listings fetch failed:", err);
        // fall back to seed data (already set)
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  /* ── Carousel scroll helpers ── */
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.offsetWidth ?? 320;
    el.scrollBy({ left: dir * (cardWidth + 32), behavior: "smooth" });
  };

  const handleAddToCart = (id) => {
    /**
     * Wire to your cart API / Redux action here.
     * e.g. dispatch(addToCart({ listingId: id }))
     */
    console.log("Add to cart:", id);
  };

  return (
    <section className="bg-surface-container-low py-24 mb-24">
      <div className="max-w-[1440px] mx-auto px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-4xl font-headline font-bold">Freshly Added</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Skeleton loader */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="h-72 bg-surface-container-high" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-surface-container-high rounded w-3/4" />
                  <div className="h-4 bg-surface-container-high rounded w-1/2" />
                  <div className="h-10 bg-surface-container-high rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product grid — scrollable on smaller screens */}
        {!loading && (
          <div
            ref={scrollRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 overflow-x-auto lg:overflow-visible scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {products.map((p) => (
              <div key={p.id} data-card style={{ scrollSnapAlign: "start" }}>
                <ProductCard {...p} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}