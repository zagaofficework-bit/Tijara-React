// src/components/home/JobBoardSection.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── COLOUR TOKENS (light theme) ─────────────────────────────────
const FF = "Manrope, sans-serif";
const C = {
  brand:      "#1D546D",
  brandLight: "#EBF4F7",
  brandMid:   "#5F9598",
  surface:    "#FFFFFF",
  surface2:   "#F7F9FA",
  border:     "#E4EAED",
  textHi:     "#0E1E25",
  textLo:     "#6B8898",
};

// ─── DUMMY JOBS ARE HERE ──────────────────────────────────────────
// 📌 These 4 rows are placeholder data.
//
// When your real API is ready:
//   1. Uncomment the useEffect block below (search "REAL API").
//   2. Delete the DUMMY_JOBS array.
//   3. Use the normJob() mapper to shape the API response.
//      The card UI will need zero changes.
// ─────────────────────────────────────────────────────────────────
const DUMMY_JOBS = [
  {
    id: "j1",
    title: "Senior React Developer",
    company: "QuickHive Core Engineering",
    location: "Remote / Mumbai",
    salaryMin: 18,
    salaryMax: 28,
    unit: "LPA",
    icon: "fa-code",
    iconBg: "#EBF4F7",
    iconColor: "#1D546D",
  },
  {
    id: "j2",
    title: "Lead Product Designer",
    company: "Fintech Solutions Pvt Ltd",
    location: "Andheri, Mumbai",
    salaryMin: 15,
    salaryMax: 24,
    unit: "LPA",
    icon: "fa-pen-nib",
    iconBg: "#FFF0F7",
    iconColor: "#C0346B",
  },
  {
    id: "j3",
    title: "Sales & Marketing Executive",
    company: "PropTech India",
    location: "Pune, MH",
    salaryMin: 4,
    salaryMax: 7,
    unit: "LPA",
    icon: "fa-chart-line",
    iconBg: "#FFF8EC",
    iconColor: "#C77A00",
  },
  {
    id: "j4",
    title: "IT Engineer / Developer",
    company: "CloudBase Systems",
    location: "Thane, MH",
    salaryMin: 10,
    salaryMax: 16,
    unit: "LPA",
    icon: "fa-server",
    iconBg: "#F0FBF4",
    iconColor: "#1A8A4A",
  },
];

// ─── REAL API — uncomment when backend is ready ───────────────────
// import { useEffect } from "react";
//
// function normJob(item, idx) {
//   const icons = ["fa-code","fa-pen-nib","fa-chart-line","fa-server","fa-briefcase"];
//   const bgs   = ["#EBF4F7","#FFF0F7","#FFF8EC","#F0FBF4"];
//   const clrs  = ["#1D546D","#C0346B","#C77A00","#1A8A4A"];
//   return {
//     id:        item.id,
//     title:     item.name || item.translated_name,
//     company:   item.user?.name || "Company",
//     location:  [item.city, item.state].filter(Boolean).join(", ") || "India",
//     salaryMin: item.min_salary || 0,
//     salaryMax: item.max_salary || 0,
//     unit:      "LPA",
//     icon:      icons[idx % icons.length],
//     iconBg:    bgs[idx % bgs.length],
//     iconColor: clrs[idx % clrs.length],
//   };
// }
//
// useEffect(() => {
//   fetch("https://www.zagainstitute.com/tijaraa/public/api/get-item?category_id=7&limit=4")
//     .then(r => r.json())
//     .then(json => {
//       if (!json.error) setJobs((json.data?.data || []).map(normJob));
//     })
//     .catch(console.error);
// }, []);
// ─────────────────────────────────────────────────────────────────

export default function JobBoardSection() {
  const navigate = useNavigate();
  const [jobs]   = useState(DUMMY_JOBS);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 pb-16 md:pb-24 max-w-[1440px] mx-auto">

      {/* Outer card — white surface */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        {/* Brand top strip */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${C.brand}, ${C.brandMid})` }} />

        <div className="p-5 md:p-8 lg:p-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-7 gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] mb-1" style={{ color: C.brandMid, fontFamily: FF }}>
                Hiring Now
              </p>
              {/* Dark text on white card = max contrast */}
              <h2 className="font-black leading-tight" style={{ color: C.textHi, fontFamily: FF, fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)", letterSpacing: "-0.02em" }}>
                Career Opportunities
              </h2>
              <p className="text-sm mt-1" style={{ color: C.textLo, fontFamily: FF }}>
                Top companies hiring this week.
              </p>
            </div>
            <button
              onClick={() => navigate("/careers")}
              className="shrink-0 flex items-center gap-2 font-black text-[12px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-95 text-white"
              style={{ background: C.brand, border: "none", cursor: "pointer", fontFamily: FF }}
            >
              Browse All Jobs
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>

          {/* Job list */}
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl transition-all group gap-3 p-4 md:p-5 cursor-pointer"
                style={{ background: C.surface2, border: `1px solid ${C.border}` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.brand + "50";
                  e.currentTarget.style.transform = "translateX(3px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(29,84,109,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => navigate(`/careers/${job.id}`)}
              >
                {/* Left: icon + info */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: job.iconBg }}
                  >
                    <i className={`fa-solid ${job.icon} text-[16px]`} style={{ color: job.iconColor }} />
                  </div>
                  <div className="min-w-0">
                    {/* Dark text on surface2 = readable */}
                    <h4
                      className="font-black text-[14px] truncate group-hover:text-[#1D546D] transition-colors"
                      style={{ color: C.textHi, fontFamily: FF }}
                    >
                      {job.title}
                    </h4>
                    <p className="text-[12px] truncate" style={{ color: C.textLo, fontFamily: FF }}>
                      {job.company}
                      <span className="mx-1.5 opacity-40">•</span>
                      <i className="fa-solid fa-location-dot text-[10px] mr-0.5" />
                      {job.location}
                    </p>
                  </div>
                </div>

                {/* Right: salary + button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 shrink-0 pl-14 sm:pl-0">
                  {(job.salaryMin || job.salaryMax) > 0 && (
                    <div className="text-left sm:text-right">
                      {/* Brand colour text on white/surface = accessible */}
                      <p className="font-black text-[14px]" style={{ color: C.brand, fontFamily: FF }}>
                        {job.salaryMin}–{job.salaryMax} {job.unit}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-black" style={{ color: C.textLo, fontFamily: FF }}>
                        Base Salary
                      </p>
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/careers/${job.id}`); }}
                    className="flex items-center gap-1.5 font-black text-[12px] rounded-xl px-4 py-2 transition-all hover:opacity-90 active:scale-95 whitespace-nowrap text-white"
                    style={{ background: C.brand, border: "none", cursor: "pointer", fontFamily: FF }}
                  >
                    Apply Now
                    <i className="fa-solid fa-arrow-right text-[9px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}