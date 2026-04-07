// src/components/home/HeroSection.jsx
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12 md:mb-16">
      <div className="relative h-[420px] sm:h-[500px] md:h-[600px] rounded-xl overflow-hidden group">

        {/* Background image */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFv5xhP3iONxaA6Fyg0_bqiKIsJagK1rgApFzqmDp5_Lh7qYjglGsDUb2lev47DslxAYCXhSvwqQp3VMcil2FRVfNQHoWsHah3bE2aW73DwcpIlOzGgWbkedz5aKxX_qK0rD0bL4sdM5GqvoNtpWbKDGjEYbVTjZM9YzdqyME08xN3LU_QR3fjlBONQMzn_naT_7MzwwEJUVSHfHuSrFkBYgf2Mq3OJV7tFGuRbxmhv5oCIICLYmKki225ejVUd6h6z8QKdxpE_zw"
          alt="Sophisticated modern retail space"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061E29]/90 via-[#061E29]/60 to-transparent flex items-center px-6 sm:px-10 md:px-20">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px] uppercase tracking-widest rounded-full mb-4 md:mb-6">
              Featured Marketplace
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-white leading-tight mb-4 md:mb-8">
              Discover the Future{" "}
              <br className="hidden sm:block" />
              of Commerce
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/80 font-body mb-6 md:mb-10 max-w-md">
              Curated selections from the world's most trusted sellers.
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <button
                onClick={() => navigate("/listings")}
                className="bg-[#30647e] text-white px-5 md:px-8 py-3 md:py-4 rounded-md font-bold text-sm md:text-base shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Explore Collection
              </button>
              <button
                onClick={() => navigate("/how-it-works")}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 md:px-8 py-3 md:py-4 rounded-md font-bold text-sm md:text-base hover:bg-white/20 transition-all"
              >
                How it Works
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}