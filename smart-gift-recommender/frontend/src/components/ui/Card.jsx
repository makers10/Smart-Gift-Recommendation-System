/**
 * Card primitive — Gift with Love design system.
 *
 * A composable surface component. Provides the standard ivory background,
 * brand border, and shadow. Children provide all content.
 *
 * Props:
 *   variant  — "default" | "flat" | "lifted"
 *   padding  — "none" | "sm" | "md" (default) | "lg"
 *   as       — HTML tag or component to render as (default: "div")
 *   className — additional Tailwind classes
 */
export function Card({
  variant = "default",
  padding = "md",
  as: Tag = "div",
  className = "",
  children,
  ...props
}) {
  const variantClasses = {
    default: "bg-[#241620]/95 border border-[#4A1830] text-[#FFF7E9] shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl",
    flat:    "bg-[#1C131A]/90 border border-[#4A1830]/70 text-[#FFF7E9]",
    lifted:  "bg-[#2B1825]/95 border border-[#4A1830] hover:border-[#C69A55]/60 text-[#FFF7E9] shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_45px_rgba(198,154,85,0.2)] transition-all",
    luxury:  "bg-gradient-to-br from-[#261722]/95 via-[#1E131B]/95 to-[#17131A]/95 border border-[#4A1830] hover:border-[#C69A55]/60 text-[#FFF7E9] shadow-[0_12px_40px_rgba(198,154,85,0.2)] transition-all",
  };

  const paddingClasses = {
    none: "",
    sm:   "p-4",
    md:   "p-6",
    lg:   "p-8",
  };

  return (
    <Tag
      className={[
        "rounded-2xl overflow-hidden",
        variantClasses[variant] || variantClasses.default,
        paddingClasses[padding],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Convenience sub-components for structured card layouts. */
export function CardHeader({ className = "", children, ...props }) {
  return (
    <div
      className={["mb-4", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3
      className={[
        "font-serif text-xl sm:text-2xl font-bold text-[#FFF7E9] tracking-wide leading-snug",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardBody({ className = "", children, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
