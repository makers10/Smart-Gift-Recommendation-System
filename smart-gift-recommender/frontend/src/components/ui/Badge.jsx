/**
 * Badge primitive — Gift with Love design system.
 *
 * Small inline labels for status, occasion, relationship, and budget context.
 *
 * Variants:
 *   brand     — burgundy background (primary highlight)
 *   rose      — rose accent (secondary, occasion chips)
 *   gold      — gold accent (featured/premium)
 *   neutral   — grey (secondary info)
 *   success   — emerald (accepted, active)
 *   warning   — amber (in-progress)
 *   outline   — transparent bg, burgundy border
 */
export default function Badge({
  variant = "neutral",
  size = "sm",
  className = "",
  children,
  ...props
}) {
  const variants = {
    brand:     "bg-[#4A1830] text-[#E9D7B8] border-[#C69A55]/30",
    rose:      "bg-[#4A1830]/80 text-rose-200 border-rose-900/60",
    gold:      "bg-[#C69A55]/15 text-[#DCB372] border-[#C69A55]/40",
    champagne: "bg-[#E9D7B8]/15 text-[#E9D7B8] border-[#E9D7B8]/30",
    neutral:   "bg-[#17131A]/90 text-[#D8CABA] border-[#4A1830]",
    success:   "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    warning:   "bg-amber-950/60 text-amber-300 border-amber-800/60",
    outline:   "bg-transparent text-[#E9D7B8] border-[#4A1830]",
  };

  const sizes = {
    xs: "text-xs px-2 py-0.5",
    sm: "text-xs px-2.5 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={[
        "inline-flex items-center font-medium border rounded-full leading-tight",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
