// src/components/home/PromoBanners.jsx
import { useNavigate } from "react-router-dom";

export default function PromoBanners() {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1440px] mx-auto px-8 mb-24">
      <div className="grid grid-cols-12 grid-rows-2 gap-6 h-auto lg:h-[500px]">

        {/* ── Large left banner ── */}
        <div
          onClick={() => navigate("/category/furniture")}
          className="col-span-12 lg:col-span-8 lg:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer h-64 lg:h-auto"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCid4v1gBLehuT7HHfZ7_Wt0rVvLD677RJfk_IRvNpl_0m4aK225mCRcr4qzbN5an0sdWUfW7r8bu-FeeiC6tYdP3vCTylfG85qh7KybCoZyHvhVIQiHVP86xoCtgFWeO6xFzhhRDdW9vZ2D3EArw0YV6WX7Lu9W1ljGKT0XYAdcYxtPSzOvj0vhAh9Sa7V7B1ROAwfj8cIoUsMKWbql6VuCB_eRwlb8MSEwZ9VYQcRNDTrAhJaBXqZMp0JpBWHembzY08XltAlog"
            alt="Luxurious living room"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-12">
            <h3 className="text-4xl font-headline font-extrabold text-white mb-4">
              Elevate Your Living Space
            </h3>
            <p className="text-white/80 mb-6 max-w-md">
              Curated interior design and furniture from top local artisans.
            </p>
            <button className="w-fit bg-white text-primary px-8 py-3 rounded-md font-bold hover:bg-secondary hover:text-white transition-all">
              Shop Furniture
            </button>
          </div>
        </div>

        {/* ── Top-right: Sell CTA ── */}
        <div
          onClick={() => navigate("/sell")}
          className="col-span-12 lg:col-span-4 lg:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer bg-primary-container h-40 lg:h-auto"
        >
          <div className="absolute inset-0 flex flex-col justify-center p-8 z-10">
            <h3 className="text-2xl font-headline font-bold text-white mb-2">
              Sell with Ease
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Join 20,000+ local sellers today.
            </p>
            <span className="text-tertiary-fixed font-bold flex items-center gap-1">
              Get Started
              <span className="material-symbols-outlined">chevron_right</span>
            </span>
          </div>
          {/* Decorative icon */}
          <div className="absolute right-[-20px] bottom-[-20px] opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 180 }}>
              payments
            </span>
          </div>
        </div>

        {/* ── Bottom-right: Tech trade-in ── */}
        <div
          onClick={() => navigate("/tech-trade-in")}
          className="col-span-12 lg:col-span-4 lg:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer h-40 lg:h-auto"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuClNP2VkraHfgw-U48URlwEqh-U-3QM3QjESwMzhVdbts0614ZFm0FVBDCNejlXImBY5XfqwGvjvHVRwQmYf-piewtM8gLnl4zFU6UbbcX6u01a-H2waPQ_afVJAztCQdGwnOpMvlYiZAW9PpXUuJu_6EccUWt9ivoRhBckwKFho5br8K4x9nrppf75bPw92ac8pZX0anCCK6YSSjs8wxT6TlfoLFbDNj4lKtvXijE8fVyO3Zpda-OsT3VpyjNnLkiP2RKqquETbkg"
            alt="Tech gadgets overhead"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm flex flex-col justify-center p-8">
            <h3 className="text-2xl font-headline font-bold text-white mb-2">
              Tech Trade-In
            </h3>
            <p className="text-white/90 text-sm">
              Upgrade your gear and get instant credit for your old devices.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}