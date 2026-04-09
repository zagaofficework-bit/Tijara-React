import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useItemDetail } from "../services/useItemDetail";
import ImageGallery from "../components/ImageGallery";
import SellerCard from "../components/SellerCard";
import MakeOfferModal from "../components/MakeOfferModal";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useItemDetail(id);
  const [offerOpen, setOfferOpen] = useState(false);
  const currentUser = useSelector((s) => s.auth?.user);
  const isOwner = currentUser?.id === item?.user_id;

  if (loading) return <DetailSkeleton />;
  if (error || !item) return <DetailError error={error} />;

  const {
    name,
    description,
    price,
    image,
    gallery_images,
    address,
    city,
    state,
    country,
    contact,
    category,
    user,
    show_only_to_premium,
    is_feature,
    status,
    expiry_date,
    clicks,
    total_likes,
    is_liked,
    created_at,
    custom_fields,
    latitude,
    longitude,
  } = item;

  const formattedPrice = price
    ? `₹${Number(price).toLocaleString("en-IN")}`
    : "Price on request";

  const location = [address || [city, state, country].filter(Boolean).join(", ")].filter(Boolean)[0];
  const postedDate = new Date(created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div
      className="min-h-screen bg-[#F3F4F4] dark:bg-[#040F14] pt-[68px] sm:pt-[80px] pb-[88px] lg:pb-0"
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-[#061E29] border-b border-gray-100 dark:border-[#1D546D]/20 px-4 sm:px-6 lg:px-10 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400 flex-wrap">
          <Link to="/" className="hover:text-[#1D546D] transition-colors">Home</Link>
          <i className="fa-solid fa-chevron-right text-[9px]" />
          <Link to="/items" className="hover:text-[#1D546D] transition-colors">Listings</Link>
          {category?.name && (
            <>
              <i className="fa-solid fa-chevron-right text-[9px]" />
              <span className="text-gray-400">{category.name}</span>
            </>
          )}
          <i className="fa-solid fa-chevron-right text-[9px]" />
          <span className="text-[#061E29] dark:text-white font-semibold truncate max-w-[160px]">{name}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left Column ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Gallery */}
            <ImageGallery mainImage={image} galleryImages={gallery_images} name={name} />

            {/* Title + Price card */}
            <div className="bg-white dark:bg-[#061E29] rounded-2xl border border-gray-100 dark:border-[#1D546D]/30 p-5">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-3">
                {is_feature && (
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-[#061E29] dark:bg-white/10 text-white rounded-lg">
                    Featured
                  </span>
                )}
                {show_only_to_premium === 1 && (
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-[#1D546D]/10 dark:bg-[#1D546D]/20 text-[#1D546D] dark:text-[#5F9598] rounded-lg">
                    Premium Only
                  </span>
                )}
                {category?.name && (
                  <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#5F9598]/10 text-[#1D546D] dark:text-[#5F9598] rounded-lg">
                    {category.name}
                  </span>
                )}
                <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                  status === "approved"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                }`}>
                  {status === "approved" ? "Available" : status}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-[22px] sm:text-[26px] font-black text-[#061E29] dark:text-white mb-2 leading-tight">
                {name}
              </h1>

              {/* Price */}
              <p className="text-[28px] sm:text-[32px] font-black text-[#1D546D] dark:text-[#5F9598] mb-4">
                {formattedPrice}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 text-[12px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-[#1D546D]/20 pt-4">
                {location && (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-location-dot text-[#5F9598] text-[11px]" />
                    {location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar text-[#5F9598] text-[11px]" />
                  Posted {postedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-regular fa-eye text-[#5F9598] text-[11px]" />
                  {clicks || 0} views
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-regular fa-heart text-[#5F9598] text-[11px]" />
                  {total_likes || 0} likes
                </span>
                {expiry_date && (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-regular fa-clock text-[#5F9598] text-[11px]" />
                    Expires {new Date(expiry_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="bg-white dark:bg-[#061E29] rounded-2xl border border-gray-100 dark:border-[#1D546D]/30 p-5">
                <h2 className="text-[15px] font-black text-[#061E29] dark:text-white mb-3">Description</h2>
                <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {/* Custom fields */}
            {custom_fields?.length > 0 && (
              <div className="bg-white dark:bg-[#061E29] rounded-2xl border border-gray-100 dark:border-[#1D546D]/30 p-5">
                <h2 className="text-[15px] font-black text-[#061E29] dark:text-white mb-4">Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {custom_fields.map((field, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-3 bg-[#F3F4F4] dark:bg-[#0d2f3f] rounded-xl"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#5F9598] uppercase tracking-wide mb-0.5">
                          {field.name}
                        </p>
                        <p className="text-[13px] font-semibold text-[#061E29] dark:text-white truncate">
                          {field.value || "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {latitude && longitude && (
              <div className="bg-white dark:bg-[#061E29] rounded-2xl border border-gray-100 dark:border-[#1D546D]/30 p-5">
                <h2 className="text-[15px] font-black text-[#061E29] dark:text-white mb-3">Location</h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-[#5F9598]" />
                  {location}
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-[#1D546D]/20" style={{ height: 200 }}>
                  <iframe
                    title="map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column (sticky sidebar) ── */}
          <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-4">

            {/* Seller card (desktop only) */}
            <div className="hidden lg:block">
              <SellerCard user={user} contact={contact} showContact={user?.show_personal_details} />
            </div>

            {/* Make Offer + price card (desktop only) */}
            {!isOwner && (
              <div className="hidden lg:flex flex-col bg-white dark:bg-[#061E29] border border-gray-100 dark:border-[#1D546D]/30 rounded-2xl p-5 gap-3">
                <div>
                  <p className="text-[11px] font-bold text-[#5F9598] uppercase tracking-wide mb-1">Listed price</p>
                  <p className="text-[28px] font-black text-[#1D546D] dark:text-[#5F9598]">{formattedPrice}</p>
                </div>
                <div className="flex flex-col gap-2.5 pt-1 border-t border-gray-100 dark:border-[#1D546D]/20">
                  <button
                    onClick={() => navigate("/chat", { state: { sellerId: user?.id, sellerName: user?.name, itemId: item.id, itemName: name } })}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-black bg-[#1D546D] text-white rounded-xl hover:bg-[#061E29] transition-colors"
                  >
                    <i className="fa-solid fa-comment-dots text-[14px]" />
                    Start Chat
                  </button>
                  {contact && user?.show_personal_details && (
                    <a
                      href={`tel:${contact}`}
                      className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-black text-[#1D546D] dark:text-[#5F9598] border-2 border-[#1D546D]/30 dark:border-[#5F9598]/30 rounded-xl hover:bg-[#1D546D]/5 transition-colors"
                    >
                      <i className="fa-solid fa-phone text-[13px]" />
                      Call Seller
                    </a>
                  )}
                  <button
                    onClick={() => setOfferOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-black text-[#061E29] dark:text-white border-2 border-[#061E29]/20 dark:border-[#5F9598]/30 rounded-xl hover:bg-[#061E29]/5 dark:hover:bg-[#5F9598]/5 transition-colors"
                  >
                    <i className="fa-solid fa-tag text-[13px]" />
                    Make an Offer
                  </button>
                </div>
              </div>
            )}

            {/* Safety tip */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-start gap-2.5">
                <i className="fa-solid fa-shield-halved text-amber-500 text-[16px] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-amber-700 dark:text-amber-400 mb-1">Safety tip</p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-500 leading-relaxed">
                    Always meet in a public place. Never send money in advance. Verify the item before payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white dark:bg-[#061E29] border border-gray-100 dark:border-[#1D546D]/30 rounded-2xl p-4">
              <p className="text-[12px] font-bold text-[#061E29] dark:text-white mb-3">Share this listing</p>
              <div className="flex gap-2">
                {[
                  { icon: "fa-whatsapp", color: "#25D366", href: `https://wa.me/?text=${encodeURIComponent(`Check out: ${name} - ${window.location.href}`)}` },
                  { icon: "fa-facebook", color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                  { icon: "fa-twitter", color: "#1DA1F2", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(name)}` },
                ].map(({ icon, color, href }) => (
                  <a
                    key={icon}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 dark:border-[#1D546D]/30 hover:border-gray-300 transition-colors"
                    style={{ color }}
                  >
                    <i className={`fa-brands ${icon} text-[16px]`} />
                  </a>
                ))}
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 dark:border-[#1D546D]/30 hover:border-gray-300 transition-colors text-gray-400"
                >
                  <i className="fa-solid fa-link text-[14px]" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Sticky Mobile Bottom Action Bar ── */}
      {!isOwner && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#061E29] border-t border-gray-100 dark:border-[#1D546D]/30 px-4 py-3 safe-area-pb">
          <div className="flex items-center gap-2.5 max-w-[600px] mx-auto">

            {/* Price pill */}
            <div className="shrink-0">
              <p className="text-[10px] font-semibold text-[#5F9598] leading-tight">Listed at</p>
              <p className="text-[15px] font-black text-[#1D546D] dark:text-[#5F9598] leading-tight">{formattedPrice}</p>
            </div>

            <div className="flex-1 flex items-center gap-2">
              {/* Chat */}
              <button
                onClick={() => navigate("/chat", { state: { sellerId: user?.id, sellerName: user?.name, itemId: item.id, itemName: name } })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-black bg-[#1D546D] text-white rounded-xl hover:bg-[#061E29] transition-colors"
              >
                <i className="fa-solid fa-comment-dots text-[13px]" />
                Chat
              </button>

              {/* Call */}
              {contact && user?.show_personal_details && (
                <a
                  href={`tel:${contact}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-black text-[#1D546D] dark:text-[#5F9598] border-2 border-[#1D546D]/30 dark:border-[#5F9598]/30 rounded-xl hover:bg-[#1D546D]/5 transition-colors"
                >
                  <i className="fa-solid fa-phone text-[12px]" />
                  Call
                </a>
              )}

              {/* Make Offer */}
              <button
                onClick={() => setOfferOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-black text-white bg-[#061E29] dark:bg-[#5F9598] rounded-xl hover:opacity-90 transition-colors"
              >
                <i className="fa-solid fa-tag text-[12px]" />
                Make Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer modal */}
      {offerOpen && (
        <MakeOfferModal item={item} onClose={() => setOfferOpen(false)} />
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F3F4F4] dark:bg-[#040F14] pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4 animate-pulse">
            <div className="bg-gray-200 dark:bg-[#0d2f3f] rounded-2xl" style={{ aspectRatio: "4/3" }} />
            <div className="bg-white dark:bg-[#061E29] rounded-2xl p-5 space-y-3">
              <div className="h-5 w-1/4 bg-gray-100 dark:bg-[#0d2f3f] rounded" />
              <div className="h-8 w-2/3 bg-gray-100 dark:bg-[#0d2f3f] rounded" />
              <div className="h-10 w-1/3 bg-gray-100 dark:bg-[#0d2f3f] rounded" />
            </div>
          </div>
          <div className="w-full lg:w-[300px] space-y-4 animate-pulse">
            <div className="bg-white dark:bg-[#061E29] rounded-2xl h-48" />
            <div className="bg-white dark:bg-[#061E29] rounded-2xl h-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailError({ error }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F3F4F4] dark:bg-[#040F14] pt-[80px] flex items-center justify-center px-4">
      <div className="text-center" style={{ fontFamily: "Manrope, sans-serif" }}>
        <div className="w-20 h-20 rounded-full bg-[#1D546D]/10 flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-circle-exclamation text-[32px] text-[#1D546D]" />
        </div>
        <h2 className="text-[18px] font-black text-[#061E29] dark:text-white mb-2">Item not found</h2>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-5">{error || "This listing may have been removed."}</p>
        <button
          onClick={() => navigate("/items")}
          className="px-6 py-2.5 text-[13px] font-bold bg-[#1D546D] text-white rounded-xl hover:bg-[#061E29] transition-colors"
        >
          Back to Listings
        </button>
      </div>
    </div>
  );
}