// src/components/home/HeroSection.jsx
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────
// COLOUR TOKENS  (light ecom theme — shared across all components)
//   brand      #1D546D   deep teal  — CTA buttons, active states
//   brandLight #EBF4F7   tint       — hover backgrounds
//   brandMid   #5F9598   accent     — badges, icon highlights
//   surface    #FFFFFF   card / section bg
//   surface2   #F7F9FA   page / offset bg
//   border     #E4EAED   dividers
//   textHi     #0E1E25   headings, primary text
//   textLo     #6B8898   muted labels
// ─────────────────────────────────────────────────────────────────

const FF = "Manrope, sans-serif";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 pt-4 pb-10 md:pb-14 max-w-[1440px] mx-auto">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ minHeight: "clamp(340px, 48vw, 580px)" }}
      >
        {/* Background image */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFv5xhP3iONxaA6Fyg0_bqiKIsJagK1rgApFzqmDp5_Lh7qYjglGsDUb2lev47DslxAYCXhSvwqQp3VMcil2FRVfNQHoWsHah3bE2aW73DwcpIlOzGgWbkedz5aKxX_qK0rD0bL4sdM5GqvoNtpWbKDGjEYbVTjZM9YzdqyME08xN3LU_QR3fjlBONQMzn_naT_7MzwwEJUVSHfHuSrFkBYgf2Mq3OJV7tFGuRbxmhv5oCIICLYmKki225ejVUd6h6z8QKdxpE_zw"
          alt="QuickHive marketplace"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45)" }}
        />

        {/* Gradient overlay — left-heavy so text is always readable */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(110deg, rgba(14,30,37,0.92) 0%, rgba(29,84,109,0.70) 50%, rgba(29,84,109,0.15) 100%)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 md:px-16 py-12 md:py-16">
          <div className="max-w-[520px]">

            {/* Badge */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-5 md:mb-6"
              style={{ background: "rgba(95,149,152,0.25)", border: "1px solid rgba(95,149,152,0.5)", color: "#A8D5DA", fontFamily: FF }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A8D5DA]" />
              Featured Marketplace
            </span>

            {/* Headline — white on dark overlay = perfect contrast */}
            <h1
              className="font-black text-white leading-[1.06] mb-4 md:mb-6"
              style={{ fontFamily: FF, fontSize: "clamp(1.9rem, 4.5vw, 3.5rem)", letterSpacing: "-0.025em" }}
            >
              India's Smartest{" "}
              <br className="hidden sm:block" />
              Buy & Sell{" "}
              <span style={{ color: "#A8D5DA" }}>Platform</span>
            </h1>

            {/* Sub text — white/80 on dark = passes contrast */}
            <p
              className="mb-7 md:mb-9 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.78)", fontFamily: FF, fontSize: "clamp(0.875rem, 1.5vw, 1rem)", maxWidth: 400 }}
            >
              Cars, property, electronics, jobs and more — all in one place. Trusted by 20,000+ verified sellers.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/items")}
                className="flex items-center gap-2 font-black text-[13px] text-white rounded-xl px-6 py-3 transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#1D546D", fontFamily: FF }}
              >
                Browse Listings
                <i className="fa-solid fa-arrow-right text-[11px]" />
              </button>
              <button
                onClick={() => navigate("/how-it-works")}
                className="flex items-center gap-2 font-black text-[13px] rounded-xl px-6 py-3 transition-all hover:bg-white/20 active:scale-95"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "white", fontFamily: FF }}
              >
                How it Works
              </button>
            </div>

            {/* Stats — white text on dark overlay is perfectly readable */}
            <div className="flex gap-6 md:gap-10 mt-9 flex-wrap">
              {[
                { val: "50K+", label: "Active Listings" },
                { val: "20K+", label: "Verified Sellers" },
                { val: "14",   label: "Categories" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p className="text-xl md:text-2xl font-black text-white leading-tight" style={{ fontFamily: FF }}>{val}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: "#A8D5DA", fontFamily: FF }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}