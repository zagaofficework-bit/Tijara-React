// src/components/home/PromoBanners.jsx
import { useNavigate } from "react-router-dom";

export default function PromoBanners() {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-14 md:mb-24">

      {/* Mobile: stacked vertical; Desktop: bento 12-col grid */}
      <div className="flex flex-col md:grid md:grid-cols-12 md:grid-rows-2 gap-4 md:gap-6 md:h-[500px]">

        {/* ── Large banner (left / full-width on mobile) ── */}
        <div
          onClick={() => navigate("/category/furniture")}
          className="relative rounded-xl overflow-hidden group cursor-pointer h-64 sm:h-80 md:col-span-8 md:row-span-2 md:h-auto"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCid4v1gBLehuT7HHfZ7_Wt0rVvLD677RJfk_IRvNpl_0m4aK225mCRcr4qzbN5an0sdWUfW7r8bu-FeeiC6tYdP3vCTylfG85qh7KybCoZyHvhVIQiHVP86xoCtgFWeO6xFzhhRDdW9vZ2D3EArw0YV6WX7Lu9W1ljGKT0XYAdcYxtPSzOvj0vhAh9Sa7V7B1ROAwfj8cIoUsMKWbql6VuCB_eRwlb8MSEwZ9VYQcRNDTrAhJaBXqZMp0JpBWHembzY08XltAlog"
            alt="Luxurious living room"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 md:p-12">
            <h3 className="text-2xl md:text-4xl font-headline font-extrabold text-white mb-2 md:mb-4">
              Elevate Your Living Space
            </h3>
            <p className="text-white/80 mb-4 md:mb-6 text-sm md:text-base max-w-md hidden sm:block">
              Curated interior design and furniture from top local artisans.
            </p>
            <button className="w-fit bg-white text-primary px-5 md:px-8 py-2.5 md:py-3 rounded-md font-bold text-sm hover:bg-secondary hover:text-white transition-all">
              Shop Furniture
            </button>
          </div>
        </div>

        {/* ── Sell CTA ── */}
        <div
          onClick={() => navigate("/sell")}
          className="relative rounded-xl overflow-hidden group cursor-pointer bg-black h-36 sm:h-44 md:col-span-4 md:row-span-1 md:h-auto"
        >
          <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8 z-10">
            <h3 className="text-xl md:text-2xl font-headline font-bold text-white mb-1 md:mb-2">
              Sell with Ease
            </h3>
            <p className="text-white/60 text-xs md:text-sm mb-3 md:mb-4">
              Join 20,000+ local sellers today.
            </p>
            <span className="text-gray-300  font-bold flex items-center gap-1 text-sm">
              Get Started
              <span className="material-symbols-outlined text-lg"><i class="fa-solid fa-chevron-right"></i></span>
            </span>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 140 }}>
              payments
            </span>
          </div>
        </div>

        {/* ── Tech trade-in ── */}
        <div
          onClick={() => navigate("/tech-trade-in")}
          className="relative rounded-xl overflow-hidden group cursor-pointer h-36 sm:h-44 md:col-span-4 md:row-span-1 md:h-auto"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuClNP2VkraHfgw-U48URlwEqh-U-3QM3QjESwMzhVdbts0614ZFm0FVBDCNejlXImBY5XfqwGvjvHVRwQmYf-piewtM8gLnl4zFU6UbbcX6u01a-H2waPQ_afVJAztCQdGwnOpMvlYiZAW9PpXUuJu_6EccUWt9ivoRhBckwKFho5br8K4x9nrppf75bPw92ac8pZX0anCCK6YSSjs8wxT6TlfoLFbDNj4lKtvXijE8fVyO3Zpda-OsT3VpyjNnLkiP2RKqquETbkg"
            alt="Tech gadgets"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm flex flex-col justify-center p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-headline font-bold text-white mb-1 md:mb-2">
              Tech Trade-In
            </h3>
            <p className="text-white/90 text-xs md:text-sm">
              Upgrade your gear and get instant credit for old devices.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}