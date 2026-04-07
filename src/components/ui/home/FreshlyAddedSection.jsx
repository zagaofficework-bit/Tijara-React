// src/components/home/FreshlyAddedSection.jsx
import { useState, useEffect, useRef } from "react";
import ProductCard from "../../shared/ProductCard";

const SEED_PRODUCTS = [
  {
    id: "seed-1",
    title: "Ultra-light Athletic Pro",
    price: "$299.00",
    location: "Brooklyn, NY",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCojrwlCeSkGNe0oBvQePqQdGMQG_LCq7Y-7K_zTHDVReh9p-RrsraZzXVOtQHqStR8M7tWyE0in2mAysRDEkeHvUQ5o-Ji1Igr1hpm33AvUPwL3N4eolFt3F4iU1z7-5KCb2nWbACq7X96m4RZbYJmOomFQWBd79zAg_esNcp0V3cZMG0UpH8jgjOC7S1Y9k5VEkX7R7P3yQmP3Z3gxiF2h8dOYb9TxoctGNlNz9P5VHalPa_37iosaGY5OMaKT4aiFWdYow6p3b8",
  },
  {
    id: "seed-2",
    title: "Heritage Chronograph",
    price: "$1,250.00",
    location: "Manhattan, NY",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs6h_P0FB-aNz6OLL2HnT8BGT_j1uw7y37_m3TCyMUsFwOlg51ZMN_nQ7_RqgPZLdrJLKYLddXrTgcNHkxlsT12fqhDE-TviIUqB0mzvr5aWCgIXkfKGylh3Aromj_XkZlOGC2radeWHlvDC7ICJ6CRpOyctL5ydsl3xYC57K9jDXLjP3N4UdK4OjikZYbObybc02j0IWQl25hXxo7idBNzhW3K6CZ4qisF10NWbe4thtMOOFXdtfntoGFJIRyYb5G7v6hpTRTJUc",
  },
  {
    id: "seed-3",
    title: "Noise-Cancelling Solo",
    price: "$450.00",
    location: "Queens, NY",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMumNjAmcRv4HQgGAqXjw85acONX_67oHdgifGcNw3LoRhOC__pO3c3FbZ01PZFwNod3I9b64c01T8AzHXQOz8Yyd174BVV86EqZLFDV_gVSjLGwlanaMcgeFaCfk15qoKHYafyy9HHP7IUlh7Mjjcl1Vm_Et0tLKMjJsZbTZra4tuxL-GH4qr_x6Kx9GukohrnrKl7UFLItywHg4X6p6qrg9I9dvZGCNNx-5x9S8iaDwOvpF5Y5LPntetywyavDbhDYdQs0f1WQA",
  },
  {
    id: "seed-4",
    title: "Aerowalk X Gen",
    price: "$180.00",
    location: "Jersey City, NJ",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq_6ViovXiETvcAgpwwgfGH15OY3GyrvrNpsyvPGK8TCD-pZ3xGaer0AR9S4MgKyZzOJJnJKQ-qVW2_RegNS3dOlPewH4RW3sucnxQVaBRskZBkOqw3gi_Jnr0YO9wUacm438BroQoX2NF4Z4qUayDE3-uPRHVOsw8djihfNwbTbbhbm42O4q66wJEmW3dvnF6ZQ3O48Bhfsd5r4RxaPHvb2DY8W5pzS1xcIkrpJenO6m9hOEJUM8NOH72on3QClLI_nE2AKAVsVQ",
  },
];

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
  const [loading,  setLoading]  = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/listings?sort=newest&limit=8", { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.listings ?? data.data ?? [];
          if (items.length) setProducts(items.map(normaliseListing));
        }
      } catch (e) {
        if (e.name !== "AbortError") console.warn("Listings fetch failed:", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const gap  = 16;
    const step = (card?.offsetWidth ?? 280) + gap;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const handleAddToCart = (id) => {
    // dispatch(addToCart({ listingId: id }))
    console.log("Add to cart:", id);
  };

  return (
    <section className="bg-surface-container-low py-14 md:py-24 mb-14 md:mb-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Freshly Added</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl"><i class="fa-solid fa-chevron-left"></i></span>
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl"><i class="fa-solid fa-chevron-right"></i></span>
            </button>
          </div>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 sm:h-60 md:h-72 bg-surface-container-high" />
                <div className="p-4 md:p-6 space-y-3">
                  <div className="h-4 bg-surface-container-high rounded w-3/4" />
                  <div className="h-3 bg-surface-container-high rounded w-1/2" />
                  <div className="h-9 bg-surface-container-high rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products
            Mobile:  horizontal scroll (snap)
            Desktop: static 4-column grid */}
        {!loading && (
          <>
            {/* Mobile horizontal scroll */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 md:hidden"
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  data-card
                  className="flex-shrink-0 w-[72vw] max-w-[280px] snap-start"
                >
                  <ProductCard {...p} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((p) => (
                <div key={p.id} data-card>
                  <ProductCard {...p} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}