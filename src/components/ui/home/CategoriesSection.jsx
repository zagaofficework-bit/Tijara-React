// src/components/home/CategoriesSection.jsx
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "Electronics", icon: <i class="fa-solid fa-laptop"></i>, slug: "electronics" },
  { label: "Property",    icon: <i class="fa-solid fa-city"></i>,     slug: "property" },
  { label: "Cars",        icon: <i class="fa-solid fa-car"></i> , slug: "cars" },
  { label: "Jobs",        icon: <i class="fa-solid fa-briefcase"></i>,       slug: "jobs" },
  { label: "Services",    icon: <i class="fa-solid fa-screwdriver-wrench"></i>,   slug: "services" },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-16 md:mb-24">

      {/* Header */}
      <div className="flex justify-between items-end mb-8 md:mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1 md:mb-2">
            Browse by Category
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base hidden sm:block">
            Exceptional quality across our most popular departments.
          </p>
        </div>
        <button
          onClick={() => navigate("/categories")}
          className="text-secondary font-bold flex items-center gap-1 hover:underline text-sm flex-shrink-0 ml-4"
        >
          <span className="hidden sm:inline">View All</span>
          <span className="material-symbols-outlined text-base"><i class="fa-solid fa-arrow-right"></i></span>
        </button>
      </div>

      {/* Grid: 2 cols mobile → 3 cols sm → 5 cols lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {CATEGORIES.map(({ label, icon, slug }) => (
          <button
            key={slug}
            onClick={() => navigate(`/category/${slug}`)}
            className="bg-surface-container-low p-5 md:p-8 rounded-xl flex flex-col items-center text-center group cursor-pointer hover:bg-surface-container-high transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-editorial">
              <span className="material-symbols-outlined text-secondary text-2xl md:text-3xl">
                {icon}
              </span>
            </div>
            <span className="font-headline font-bold text-sm md:text-lg">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}