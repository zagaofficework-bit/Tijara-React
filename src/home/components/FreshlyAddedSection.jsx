// src/components/home/FreshlyAddedSection.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── COLOUR TOKENS (light theme) ─────────────────────────────────
// brand      #1D546D   CTA buttons, active states
// brandLight #EBF4F7   hover bg tint
// brandMid   #5F9598   icon accent / category label
// surface    #FFFFFF   card bg
// surface2   #F7F9FA   section bg
// border     #E4EAED   dividers
// textHi     #0E1E25   primary text (headings, titles)
// textLo     #6B8898   muted labels (location, meta)
// ─────────────────────────────────────────────────────────────────

const FF = "Manrope, sans-serif";
const C = {
  brand:      "#1D546D",
  brandLight: "#EBF4F7",
  brandMid:   "#5F9598",
  surface:    "#FFFFFF",
  surface2:   "#F7F9FA",
  border:     "#E4EAED",
  textHi:     "#0E1E25",
  textLo:     "#6B8898",
};

// ─── DUMMY PRODUCTS ARE HERE ──────────────────────────────────────
// 📌 These 8 cards are placeholder data.
//
// When your real API is ready:
//   1. Uncomment the useEffect block below (search "REAL API").
//   2. Delete the DUMMY_PRODUCTS array.
//   3. The normaliseListing() mapper will shape your API response
//      into the same { id, title, price, location, category, image, isNew }
//      shape the cards already expect — so the UI needs zero changes.
// ─────────────────────────────────────────────────────────────────
const DUMMY_PRODUCTS = [
  {
    id: "d1",
    title: "Maruti Suzuki Swift VXI",
    price: "₹3,50,000",
    location: "Mira Bhayandar, MH",
    category: "Cars",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCojrwlCeSkGNe0oBvQePqQdGMQG_LCq7Y-7K_zTHDVReh9p-RrsraZzXVOtQHqStR8M7tWyE0in2mAysRDEkeHvUQ5o-Ji1Igr1hpm33AvUPwL3N4eolFt3F4iU1z7-5KCb2nWbACq7X96m4RZbYJmOomFQWBd79zAg_esNcp0V3cZMG0UpH8jgjOC7S1Y9k5VEkX7R7P3yQmP3Z3gxiF2h8dOYb9TxoctGNlNz9P5VHalPa_37iosaGY5OMaKT4aiFWdYow6p3b8",
    isNew: true,
  },
  {
    id: "d2",
    title: "2BHK Flat for Rent",
    price: "₹18,000/mo",
    location: "Andheri West, Mumbai",
    category: "Properties",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCid4v1gBLehuT7HHfZ7_Wt0rVvLD677RJfk_IRvNpl_0m4aK225mCRcr4qzbN5an0sdWUfW7r8bu-FeeiC6tYdP3vCTylfG85qh7KybCoZyHvhVIQiHVP86xoCtgFWeO6xFzhhRDdW9vZ2D3EArw0YV6WX7Lu9W1ljGKT0XYAdcYxtPSzOvj0vhAh9Sa7V7B1ROAwfj8cIoUsMKWbql6VuCB_eRwlb8MSEwZ9VYQcRNDTrAhJaBXqZMp0JpBWHembzY08XltAlog",
    isNew: false,
  },
  {
    id: "d3",
    title: "iPhone 14 Pro Max 256GB",
    price: "₹72,000",
    location: "Pune, MH",
    category: "Mobiles",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMumNjAmcRv4HQgGAqXjw85acONX_67oHdgifGcNw3LoRhOC__pO3c3FbZ01PZFwNod3I9b64c01T8AzHXQOz8Yyd174BVV86EqZLFDV_gVSjLGwlanaMcgeFaCfk15qoKHYafyy9HHP7IUlh7Mjjcl1Vm_Et0tLKMjJsZbTZra4tuxL-GH4qr_x6Kx9GukohrnrKl7UFLItywHg4X6p6qrg9I9dvZGCNNx-5x9S8iaDwOvpF5Y5LPntetywyavDbhDYdQs0f1WQA",
    isNew: true,
  },
  {
    id: "d4",
    title: "Royal Enfield Classic 350",
    price: "₹1,10,000",
    location: "Nagpur, MH",
    category: "Bikes",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq_6ViovXiETvcAgpwwgfGH15OY3GyrvrNpsyvPGK8TCD-pZ3xGaer0AR9S4MgKyZzOJJnJKQ-qVW2_RegNS3dOlPewH4RW3sucnxQVaBRskZBkOqw3gi_Jnr0YO9wUacm438BroQoX2NF4Z4qUayDE3-uPRHVOsw8djihfNwbTbbhbm42O4q66wJEmW3dvnF6ZQ3O48Bhfsd5r4RxaPHvb2DY8W5pzS1xcIkrpJenO6m9hOEJUM8NOH72on3QClLI_nE2AKAVsVQ",
    isNew: false,
  },
  {
    id: "d5",
    title: "Samsung 55\" QLED 4K TV",
    price: "₹58,500",
    location: "Thane, MH",
    category: "Electronics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCid4v1gBLehuT7HHfZ7_Wt0rVvLD677RJfk_IRvNpl_0m4aK225mCRcr4qzbN5an0sdWUfW7r8bu-FeeiC6tYdP3vCTylfG85qh7KybCoZyHvhVIQiHVP86xoCtgFWeO6xFzhhRDdW9vZ2D3EArw0YV6WX7Lu9W1ljGKT0XYAdcYxtPSzOvj0vhAh9Sa7V7B1ROAwfj8cIoUsMKWbql6VuCB_eRwlb8MSEwZ9VYQcRNDTrAhJaBXqZMp0JpBWHembzY08XltAlog",
    isNew: true,
  },
  {
    id: "d6",
    title: "L-Shape Sofa Set",
    price: "₹24,000",
    location: "Nashik, MH",
    category: "Furniture",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClNP2VkraHfgw-U48URlwEqh-U-3QM3QjESwMzhVdbts0614ZFm0FVBDCNejlXImBY5XfqwGvjvHVRwQmYf-piewtM8gLnl4zFU6UbbcX6u01a-H2waPQ_afVJAztCQdGwnOpMvlYiZAW9PpXUuJu_6EccUWt9ivoRhBckwKFho5br8K4x9nrppf75bPw92ac8pZX0anCCK6YSSjs8wxT6TlfoLFbDNj4lKtvXijE8fVyO3Zpda-OsT3VpyjNnLkiP2RKqquETbkg",
    isNew: false,
  },
  {
    id: "d7",
    title: "MacBook Air M2 8GB/256GB",
    price: "₹95,000",
    location: "Mumbai, MH",
    category: "Electronics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMumNjAmcRv4HQgGAqXjw85acONX_67oHdgifGcNw3LoRhOC__pO3c3FbZ01PZFwNod3I9b64c01T8AzHXQOz8Yyd174BVV86EqZLFDV_gVSjLGwlanaMcgeFaCfk15qoKHYafyy9HHP7IUlh7Mjjcl1Vm_Et0tLKMjJsZbTZra4tuxL-GH4qr_x6Kx9GukohrnrKl7UFLItywHg4X6p6qrg9I9dvZGCNNx-5x9S8iaDwOvpF5Y5LPntetywyavDbhDYdQs0f1WQA",
    isNew: true,
  },
  {
    id: "d8",
    title: "Honda City ZX CVT 2022",
    price: "₹8,75,000",
    location: "Aurangabad, MH",
    category: "Cars",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCojrwlCeSkGNe0oBvQePqQdGMQG_LCq7Y-7K_zTHDVReh9p-RrsraZzXVOtQHqStR8M7tWyE0in2mAysRDEkeHvUQ5o-Ji1Igr1hpm33AvUPwL3N4eolFt3F4iU1z7-5KCb2nWbACq7X96m4RZbYJmOomFQWBd79zAg_esNcp0V3cZMG0UpH8jgjOC7S1Y9k5VEkX7R7P3yQmP3Z3gxiF2h8dOYb9TxoctGNlNz9P5VHalPa_37iosaGY5OMaKT4aiFWdYow6p3b8",
    isNew: false,
  },
];

// ─── Shapes API response into what the card expects ───────────────
// Uncomment this when attaching real API
// function normaliseListing(item) {
//   return {
//     id:       item.id,
//     title:    item.name || item.translated_name,
//     price:    item.price ? `₹${Number(item.price).toLocaleString("en-IN")}` : "Price on request",
//     location: [item.city, item.state].filter(Boolean).join(", ") || "India",
//     category: item.category?.translated_name || item.category?.name || "",
//     image:    item.image || "",
//     isNew:    true,
//   };
// }

export default function FreshlyAddedSection() {
  const navigate  = useNavigate();
  const scrollRef = useRef(null);
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [loading,  setLoading]  = useState(false);

  // ─── REAL API — uncomment when backend is ready ───────────────
  // useEffect(() => {
  //   setLoading(true);
  //   fetch("https://www.zagainstitute.com/tijaraa/public/api/get-item?sort_by=latest&limit=8")
  //     .then(r => r.json())
  //     .then(json => {
  //       if (!json.error) setProducts((json.data?.data || []).map(normaliseListing));
  //     })
  //     .catch(console.error)
  //     .finally(() => setLoading(false));
  // }, []);
  // ─────────────────────────────────────────────────────────────

  const scroll = (dir) => {
    const el   = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 260) + 16), behavior: "smooth" });
  };

  return (
    <section className="w-full py-12 md:py-16" style={{ background: C.surface2 }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] mb-1" style={{ color: C.brandMid, fontFamily: FF }}>
              Just arrived
            </p>
            <h2 className="font-black leading-tight" style={{ color: C.textHi, fontFamily: FF, fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)", letterSpacing: "-0.02em" }}>
              Freshly Added
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Scroll arrows — visible on md+ */}
            <div className="hidden sm:flex gap-2">
              {[-1, 1].map((dir) => (
                <button
                  key={dir}
                  onClick={() => scroll(dir)}
                  aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textHi, cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.color = C.brand; e.currentTarget.style.background = C.brandLight; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textHi; e.currentTarget.style.background = C.surface; }}
                >
                  <i className={`fa-solid fa-chevron-${dir === -1 ? "left" : "right"} text-[11px]`} />
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate("/items")}
              className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider transition-all"
              style={{ color: C.brand, background: "none", border: "none", cursor: "pointer", fontFamily: FF }}
            >
              <span className="hidden sm:inline">View All</span>
              <i className="fa-solid fa-arrow-right text-[11px]" />
            </button>
          </div>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="h-44 sm:h-52" style={{ background: C.surface2 }} />
                <div className="p-4 space-y-2.5">
                  <div className="h-3 rounded w-1/3" style={{ background: C.surface2 }} />
                  <div className="h-4 rounded w-3/4" style={{ background: C.surface2 }} />
                  <div className="h-5 rounded w-1/2" style={{ background: C.surface2 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* Mobile: horizontal snap scroll */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {products.map((p) => (
                <div key={p.id} data-card className="flex-shrink-0 w-[74vw] max-w-[260px] snap-start">
                  <ProductCard product={p} onClick={() => navigate(`/item/${p.id}`)} />
                </div>
              ))}
            </div>

            {/* Tablet & desktop: grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <div key={p.id} data-card>
                  <ProductCard product={p} onClick={() => navigate(`/item/${p.id}`)} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 bg-white"
      style={{ border: `1px solid ${C.border}`, fontFamily: FF }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(29,84,109,0.12)";
        e.currentTarget.style.borderColor = "#1D546D40";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "4/3" }}>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* "New" badge — dark bg, white text = readable */}
        {product.isNew && (
          <span
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide text-white"
            style={{ background: C.brand }}
          >
            New
          </span>
        )}
        {/* Wishlist btn */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 bg-white"
          style={{ border: `1px solid ${C.border}`, color: C.textLo }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E11D48"; e.currentTarget.style.color = "#E11D48"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textLo; }}
        >
          <i className="fa-regular fa-heart text-[11px]" />
        </button>
      </div>

      {/* Body — all text is dark on white = perfect contrast */}
      <div className="p-3.5">
        {product.category && (
          <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: C.brandMid }}>
            {product.category}
          </p>
        )}
        <p className="font-bold text-[13px] line-clamp-1 mb-1" style={{ color: C.textHi }}>
          {product.title}
        </p>
        <p className="font-black text-[15px] mb-2" style={{ color: C.brand }}>
          {product.price}
        </p>
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-location-dot text-[10px]" style={{ color: C.brandMid }} />
          <span className="text-[11px] truncate" style={{ color: C.textLo }}>
            {product.location}
          </span>
        </div>
      </div>
    </div>
  );
}