import { useState } from "react";

const FALLBACK = "https://via.placeholder.com/800x500?text=No+Image";

export default function ImageGallery({ mainImage, galleryImages = [], name }) {
  const all = [mainImage, ...galleryImages.map((g) => g.image)].filter(Boolean);
  const images = all.length ? all : [FALLBACK];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-[#F3F4F4] dark:bg-[#0d2f3f]"
        style={{ aspectRatio: "4/3" }}
      >
        <img
          src={images[active]}
          alt={name}
          onError={(e) => { e.target.src = FALLBACK; }}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((p) => (p - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-[#061E29]/80 flex items-center justify-center text-[#1D546D] hover:bg-white dark:hover:bg-[#061E29] transition-colors"
            >
              <i className="fa-solid fa-chevron-left text-[13px]" />
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-[#061E29]/80 flex items-center justify-center text-[#1D546D] hover:bg-white dark:hover:bg-[#061E29] transition-colors"
            >
              <i className="fa-solid fa-chevron-right text-[13px]" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all ${
                    i === active
                      ? "w-5 h-2 bg-[#1D546D]"
                      : "w-2 h-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === active
                  ? "border-[#1D546D]"
                  : "border-transparent hover:border-[#5F9598]"
              }`}
            >
              <img
                src={img}
                alt={`${name} ${i + 1}`}
                onError={(e) => { e.target.src = FALLBACK; }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}