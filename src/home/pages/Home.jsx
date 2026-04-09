// src/pages/HomePage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/shared/Footer";
import HeroSection from "../../home/components/HeroSection";
import CategoriesSection from "../../home/components/CategoriesSection";
import FreshlyAddedSection from "../../home/components/FreshlyAddedSection";
import PromoBanners from "../../components/shared/PromoBanners";
import JobBoardSection from "../../home/components/JobBoardSection";

/**
 * Navbar height offsets:
 *   Mobile  → h-16 top-bar only          ≈ 64px  → pt-16
 *   Desktop → h-20 top-bar + ~40px subnav ≈ 128px → pt-32
 */
export default function HomePage() {
  const dispatch   = useDispatch();
  const user       = useSelector((s) => s.auth?.user);

  useEffect(() => {
    if (user) return;
    (async () => {
      try {
        const res = await fetch("/api/get-user-info", {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        });
        if (res.ok) {
          const data = await res.json();
          // dispatch(setUser(data.user));
          console.log("User info fetched:", data);
        }
      } catch (err) {
        console.warn("Could not fetch user info:", err);
      }
    })();
  }, [dispatch, user]);

  return (
    <div className="bg-background text-on-surface font-body selection:bg-secondary-container selection:text-on-secondary-container min-h-screen flex flex-col">
    
      {/* pt-16 on mobile (navbar = 64px), pt-[128px] on desktop (navbar + subnav ≈ 128px) */}
      <main className="pt-16 md:pt-[128px] flex-1">
        <HeroSection />
        <CategoriesSection />
        <FreshlyAddedSection />
        <PromoBanners />
        <JobBoardSection />
      </main>

      <Footer />
    </div>
  );
}