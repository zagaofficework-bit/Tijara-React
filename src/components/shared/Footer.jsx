// src/components/Footer.jsx
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Marketplace: [
    { label: "About Us", href: "/about" },
    { label: "Careers",  href: "/careers" },
    { label: "Sitemap",  href: "/sitemap" },
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

export default function Footer() {
  return (
    <footer className="bg-[#d9dada] dark:bg-[#061E29] transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full px-6 md:px-12 py-14 md:py-16 max-w-7xl mx-auto">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-[#061E29] dark:text-white mb-5 font-headline">
            Tijaraa
          </h2>
          <p className="text-[#191C1C] dark:text-gray-400 text-sm leading-relaxed mb-6">
            A premium digital curation for the modern marketplace. Connecting quality sellers with intentional buyers.
          </p>
          <div className="flex gap-3">
            {[<i class="fa-solid fa-earth-americas"></i>, <i class="fa-solid fa-share-nodes"></i>].map((icon) => (
              <button
                key={icon}
                aria-label={icon}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:text-secondary transition-all opacity-80 hover:opacity-100 hover:scale-105"
              >
                <span className="material-symbols-outlined text-sm">{icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="font-headline font-bold text-[#061E29] dark:text-white mb-5 uppercase tracking-widest text-xs">
              {heading}
            </h3>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-[#191C1C] dark:text-gray-400 hover:text-[#30647E] dark:hover:text-[#578D90] transition-all"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="w-full border-t border-black/5 dark:border-white/5 py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#191C1C] dark:text-gray-400">
          <span>© {new Date().getFullYear()} Tijaraa Marketplace. All rights reserved.</span>
          <div className="flex gap-6">
            <span>Language: <b>English (US)</b></span>
            <span>Currency: <b>USD</b></span>
          </div>
        </div>
      </div>
    </footer>
  );
}