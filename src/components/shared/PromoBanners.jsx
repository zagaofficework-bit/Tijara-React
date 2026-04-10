// src/components/home/PromoBanners.jsx
import { useNavigate } from "react-router-dom";

// ─── COLOUR TOKENS (light theme) ─────────────────────────────────
const FF = "Manrope, sans-serif";
const C = {
  brand:      "#1D546D",
  brandLight: "#EBF4F7",
  brandMid:   "#5F9598",
  surface:    "#FFFFFF",
  border:     "#E4EAED",
  textHi:     "#0E1E25",
  textLo:     "#6B8898",
};

export default function PromoBanners() {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-12 md:py-16 max-w-[1440px] mx-auto">

      {/* Section label */}
      <p className="text-[11px] font-black uppercase tracking-[0.16em] mb-6" style={{ color: C.brandMid, fontFamily: FF }}>
        Explore more
      </p>

      {/*
        Layout:
          Mobile:  stacked full-width banners
          Tablet:  2 columns
          Desktop: bento — large left (col-span-7) + 2 right stacked (col-span-5)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">

        {/* ── Large hero banner — text overlaid on image, overlay ensures contrast ── */}
        <div
          onClick={() => navigate("/category/furnitures-gardens")}
          className="relative rounded-2xl overflow-hidden group cursor-pointer sm:col-span-2 lg:col-span-7 lg:row-span-2"
          style={{ minHeight: "clamp(220px, 35vw, 440px)" }}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCid4v1gBLehuT7HHfZ7_Wt0rVvLD677RJfk_IRvNpl_0m4aK225mCRcr4qzbN5an0sdWUfW7r8bu-FeeiC6tYdP3vCTylfG85qh7KybCoZyHvhVIQiHVP86xoCtgFWeO6xFzhhRDdW9vZ2D3EArw0YV6WX7Lu9W1ljGKT0XYAdcYxtPSzOvj0vhAh9Sa7V7B1ROAwfj8cIoUsMKWbql6VuCB_eRwlb8MSEwZ9VYQcRNDTrAhJaBXqZMp0JpBWHembzY08XltAlog"
            alt="Furniture"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: "brightness(0.5)" }}
          />
          {/* Dark gradient — ensures white text is always readable */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(14,30,37,0.88) 0%, rgba(14,30,37,0.35) 55%, transparent 100%)" }}
          />
          <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10">
            <span
              className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 w-fit"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "white", fontFamily: FF }}
            >
              Furniture & Interiors
            </span>
            {/* White text on dark overlay = WCAG AA pass */}
            <h3
              className="font-black text-white mb-2 leading-tight"
              style={{ fontFamily: FF, fontSize: "clamp(1.25rem, 2.8vw, 1.9rem)" }}
            >
              Elevate Your Living Space
            </h3>
            <p className="text-white/70 mb-5 text-sm hidden sm:block max-w-xs" style={{ fontFamily: FF }}>
              Curated furniture & home décor from top local artisans.
            </p>
            <button
              className="w-fit flex items-center gap-2 font-black text-[13px] rounded-xl px-5 py-2.5 text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: C.brand, fontFamily: FF }}
            >
              Browse Furniture
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>
        </div>

        {/* ── Sell CTA — white surface, dark text = perfect contrast ── */}
        <div
          onClick={() => navigate("/sell")}
          className="relative rounded-2xl overflow-hidden group cursor-pointer sm:col-span-1 lg:col-span-5 transition-all"
          style={{
            minHeight: "clamp(140px, 16vw, 200px)",
            background: C.brand,
            border: `1px solid ${C.border}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(29,84,109,0.20)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
        >
          {/* Decorative rings */}
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10" style={{ border: "2px solid white" }} />
          <div className="absolute -right-1 -top-1 w-20 h-20 rounded-full opacity-10" style={{ border: "2px solid white" }} />

          <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-8 py-6">
            {/* White text on brand (#1D546D) bg = good contrast */}
            <p className="text-[10px] font-black uppercase tracking-[0.16em] mb-1.5" style={{ color: "rgba(255,255,255,0.65)", fontFamily: FF }}>
              For Sellers
            </p>
            <h3 className="font-black text-white mb-1.5 leading-tight" style={{ fontFamily: FF, fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}>
              Sell with Ease
            </h3>
            <p className="text-sm mb-4 hidden sm:block" style={{ color: "rgba(255,255,255,0.70)", fontFamily: FF }}>
              Join 20,000+ local sellers today.
            </p>
            <span
              className="flex items-center gap-1.5 text-[13px] font-black group-hover:gap-2.5 transition-all"
              style={{ color: "rgba(255,255,255,0.90)", fontFamily: FF }}
            >
              Get Started <i className="fa-solid fa-arrow-right text-[10px]" />
            </span>
          </div>
        </div>

        {/* ── Tech Trade-in — image with overlay ── */}
        <div
          onClick={() => navigate("/tech-trade-in")}
          className="relative rounded-2xl overflow-hidden group cursor-pointer sm:col-span-1 lg:col-span-5"
          style={{ minHeight: "clamp(140px, 16vw, 200px)" }}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuClNP2VkraHfgw-U48URlwEqh-U-3QM3QjESwMzhVdbts0614ZFm0FVBDCNejlXImBY5XfqwGvjvHVRwQmYf-piewtM8gLnl4zFU6UbbcX6u01a-H2waPQ_afVJAztCQdGwnOpMvlYiZAW9PpXUuJu_6EccUWt9ivoRhBckwKFho5br8K4x9nrppf75bPw92ac8pZX0anCCK6YSSjs8wxT6TlfoLFbDNj4lKtvXijE8fVyO3Zpda-OsT3VpyjNnLkiP2RKqquETbkg"
            alt="Tech trade-in"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ filter: "brightness(0.38)" }}
          />
          {/* Strong overlay ensures white text readability */}
          <div className="absolute inset-0" style={{ background: "rgba(14,30,37,0.55)" }} />
          <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-8 py-6">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] mb-1.5" style={{ color: "rgba(255,255,255,0.60)", fontFamily: FF }}>
              Upgrade Now
            </p>
            <h3 className="font-black text-white mb-1 leading-tight" style={{ fontFamily: FF, fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}>
              Tech Trade-In
            </h3>
            <p className="text-sm hidden sm:block" style={{ color: "rgba(255,255,255,0.70)", fontFamily: FF }}>
              Get instant credit for your old devices.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}