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
    brand:   "bg-burgundy-600 text-white border-transparent",
    rose:    "bg-rose-100 text-rose-700 border-rose-200",
    gold:    "bg-gold-200 text-gold-500 border-gold-300",
    neutral: "bg-neutral-100 text-neutral-600 border-neutral-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    outline: "bg-transparent text-burgundy-600 border-burgundy-200",
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
