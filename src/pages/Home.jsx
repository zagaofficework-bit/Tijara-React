// src/pages/HomePage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import HeroSection from "../components/ui/home/HeroSection";
import CategoriesSection from "../components/ui/home/CategoriesSection";
import FreshlyAddedSection from "../components/ui/home/FreshlyAddedSection";
import PromoBanners from "../components/shared/PromoBanners";
import JobBoardSection from "../components/ui/home/JobBoardSection";

/**
 * HomePage
 *
 * On mount it tries GET /api/get-user-info to verify the session
 * and populate the Redux auth state (user name shown in Navbar).
 *
 * Adjust the import path of your auth slice action to match your project.
 */
export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);

  useEffect(() => {
    // Only fetch if we don't already have user info in Redux
    if (user) return;

    (async () => {
      try {
        const res = await fetch("/api/get-user-info", {
          credentials: "include", // send httpOnly auth cookie if applicable
          headers: {
            // If your app stores the token in localStorage:
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          /**
           * Dispatch the user info into your auth slice.
           * Replace with whatever action your slice exposes, e.g.:
           *   dispatch(setUser(data.user))
           *   dispatch(loginUser.fulfilled({ user: data.user, token: data.token }))
           */
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
      {/* Fixed top nav — adds pt-32 to main to account for its height */}
      <Navbar />

      <main className="pt-32 flex-1">
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