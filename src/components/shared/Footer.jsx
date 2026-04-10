// src/components/shared/Footer.jsx
import { Link } from "react-router-dom";

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
  footerBg:   "#0E1E25",   // deep navy — footer gets dark bg for contrast
  footerText: "#A8BFCA",   // muted on dark
};

const FOOTER_LINKS = {
  Marketplace: [
    { label: "About Us",  href: "/about" },
    { label: "Careers",   href: "/careers" },
    { label: "Sitemap",   href: "/sitemap" },
  ],
  Resources: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Cookie Policy",    href: "/cookies" },
  ],
  Help: [
    { label: "Contact Support", href: "/support" },
    { label: "Safety Center",   href: "/safety" },
    { label: "Report Issues",   href: "/report" },
  ],
};

const SOCIALS = [
  { icon: "fa-instagram",   href: "#" },
  { icon: "fa-twitter",     href: "#" },
  { icon: "fa-facebook-f",  href: "#" },
  { icon: "fa-linkedin-in", href: "#" },
];

export default function Footer() {
  return (
    // Footer has its own dark bg (#0E1E25) so white/light text = high contrast
    <footer style={{ background: C.footerBg, fontFamily: FF }}>

      {/* Brand top border strip */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${C.brand}, ${C.brandMid}, ${C.brand})` }} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand column */}
          <div>
            {/* White text on dark footer = perfect */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.brand }}>
                <i className="fa-solid fa-bolt text-[12px] text-white" />
              </div>
              <span className="text-[17px] font-black text-white" style={{ letterSpacing: "-0.03em" }}>
                Quick<span style={{ color: C.brandMid }}>Hive</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: C.footerText }}>
              India's smartest buy & sell platform. Trusted by 20,000+ verified sellers across Maharashtra and beyond.
            </p>
            {/* Social links */}
            <div className="flex gap-2.5">
              {SOCIALS.map(({ icon, href }) => (
                <a
                  key={icon}
                  href={href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", color: C.footerText }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.brand; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = C.brand; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = C.footerText; e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
                >
                  <i className={`fa-brands ${icon} text-[13px]`} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — muted text on dark bg = readable */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3
                className="font-black text-white mb-5 uppercase tracking-[0.14em] text-[11px]"
              >
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm transition-all"
                      style={{ color: C.footerText, textDecoration: "none" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.paddingLeft = "4px"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = C.footerText; e.currentTarget.style.paddingLeft = "0"; }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div
          className="mt-10 md:mt-14 rounded-2xl p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6"
          style={{ background: "rgba(29,84,109,0.20)", border: "1px solid rgba(95,149,152,0.20)" }}
        >
          <div className="flex-1">
            {/* White on semi-dark strip = readable */}
            <p className="font-black text-white text-[14px] mb-0.5">Stay in the loop</p>
            <p className="text-[12px]" style={{ color: C.footerText }}>Get notified about new listings, deals and price drops.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-52 px-4 py-2.5 rounded-xl text-[13px] font-semibold outline-none"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "white", fontFamily: FF }}
            />
            <button
              className="px-5 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 whitespace-nowrap text-white"
              style={{ background: C.brand, border: "none", cursor: "pointer", fontFamily: FF }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-[12px]" style={{ color: C.footerText }}>
            © {new Date().getFullYear()} QuickHive Marketplace. All rights reserved.
          </span>
          <div className="flex gap-6 text-[12px]" style={{ color: C.footerText }}>
            <span>Language: <span className="font-bold text-white">English (IN)</span></span>
            <span>Currency: <span className="font-bold text-white">INR ₹</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}