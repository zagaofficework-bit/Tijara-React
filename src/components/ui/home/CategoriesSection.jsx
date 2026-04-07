// src/components/home/CategoriesSection.jsx
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "Electronics", icon: "laptop_mac", slug: "electronics" },
  { label: "Property",    icon: "domain",     slug: "property" },
  { label: "Cars",        icon: "directions_car", slug: "cars" },
  { label: "Jobs",        icon: "work",       slug: "jobs" },
  { label: "Services",    icon: "handyman",   slug: "services" },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1440px] mx-auto px-8 mb-24">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-2">Browse by Category</h2>
          <p className="text-on-surface-variant">
            Exceptional quality across our most popular departments.
          </p>
        </div>
        <button
          onClick={() => navigate("/categories")}
          className="text-secondary font-bold flex items-center gap-1 hover:underline text-sm"
        >
          View All Categories
          <span className="material-symbols-outlined text-base">trending_flat</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {CATEGORIES.map(({ label, icon, slug }) => (
          <button
            key={slug}
            onClick={() => navigate(`/category/${slug}`)}
            className="bg-surface-container-low p-8 rounded-xl flex flex-col items-center text-center group cursor-pointer hover:bg-surface-container-high transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-editorial">
              <span className="material-symbols-outlined text-secondary text-3xl">
                {icon}
              </span>
            </div>
            <span className="font-headline font-bold text-lg">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}