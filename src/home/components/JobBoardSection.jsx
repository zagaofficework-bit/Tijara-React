// src/components/home/JobBoardSection.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ICON_COLORS = ["bg-primary-container", "bg-tertiary-container", "bg-secondary-container"];
const ICONS       = ["code", "palette", "work", "engineering", "analytics"];

const SEED_JOBS = [
  { id: "j1", title: "Senior React Engineer",  company: "Tijaraa Core Infrastructure", location: "Remote / NYC",   salaryMin: 160000, salaryMax: 210000, icon: "code",    iconColor: "bg-primary-container" },
  { id: "j2", title: "Lead Product Designer",  company: "Fintech Solutions",           location: "Manhattan, NY",  salaryMin: 140000, salaryMax: 190000, icon: "palette", iconColor: "bg-tertiary-container" },
];

function formatSalary(min, max) {
  const fmt = (n) => Number(n) >= 1000 ? `$${(Number(n) / 1000).toFixed(0)}k` : `$${Number(n).toLocaleString()}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

function normJob(item, idx) {
  return {
    id:        item._id || item.id || String(idx),
    title:     item.title || item.jobTitle || "Job Opening",
    company:   item.company || item.employer || "—",
    location:  item.location || item.city || "—",
    salaryMin: item.salaryMin || item.salary?.min || 0,
    salaryMax: item.salaryMax || item.salary?.max || 0,
    icon:      ICONS[idx % ICONS.length],
    iconColor: ICON_COLORS[idx % ICON_COLORS.length],
  };
}

export default function JobBoardSection() {
  const navigate = useNavigate();
  const [jobs,    setJobs]    = useState(SEED_JOBS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/jobs?limit=5&location=New+York", { signal: controller.signal });
        if (res.ok) {
          const data  = await res.json();
          const items = Array.isArray(data) ? data : data.jobs ?? data.data ?? [];
          if (items.length) setJobs(items.map(normJob));
        }
      } catch (e) {
        if (e.name !== "AbortError") console.warn("Jobs fetch failed:", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-16 md:mb-32">
      <div className="bg-white rounded-2xl p-6 md:p-12 shadow-editorial border border-surface-container-high">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1 md:mb-2">
              Career Opportunities
            </h2>
            <p className="text-on-surface-variant text-sm md:text-base">
              Top companies hiring this week in the New York area.
            </p>
          </div>
          <button
            onClick={() => navigate("/careers")}
            className="w-full sm:w-auto px-5 py-2.5 border border-outline-variant rounded-lg font-bold hover:bg-surface-container-low transition-all text-sm text-center"
          >
            Browse All Jobs
          </button>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-surface-container-low rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Job list */}
        {!loading && (
          <div className="space-y-3 md:space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 rounded-xl hover:bg-surface-container-low transition-all group border border-transparent hover:border-outline-variant/30 gap-4"
              >
                {/* Left: icon + title */}
                <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${job.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="material-symbols-outlined text-white text-xl">{job.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base md:text-xl font-headline font-bold group-hover:text-secondary transition-colors truncate">
                      {job.title}
                    </h4>
                    <p className="text-on-surface-variant text-xs md:text-sm truncate">
                      {job.company} • {job.location}
                    </p>
                  </div>
                </div>

                {/* Right: salary + button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-10 flex-shrink-0">
                  {(job.salaryMin || job.salaryMax) > 0 && (
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-primary text-sm md:text-base">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </p>
                      <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                        Base Salary
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/careers/${job.id}`)}
                    className="bg-[#30647e] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 text-sm whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}