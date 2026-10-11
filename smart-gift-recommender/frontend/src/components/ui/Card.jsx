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
    default: "bg-white border border-ivory-300 shadow-sm",
    flat:    "bg-ivory-100 border border-ivory-200",
    lifted:  "bg-white border border-ivory-300 shadow-md hover:shadow-lg transition-shadow",
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
        "rounded-card overflow-hidden",
        variantClasses[variant],
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
        "font-serif text-xl font-semibold text-burgundy-700 leading-snug",
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
