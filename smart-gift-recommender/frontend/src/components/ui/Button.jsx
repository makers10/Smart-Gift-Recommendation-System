/**
 * Button primitive — Gift with Love design system.
 *
 * Variants:
 *   primary   — deep burgundy fill; main CTAs
 *   secondary — ivory bg with burgundy border; secondary actions
 *   ghost     — no background or border; subtle actions
 *   danger    — muted red; destructive actions
 *
 * Sizes: sm | md (default) | lg
 *
 * Includes visible focus ring, disabled state, and loading indicator.
 * Uses accessible <button> semantics; render as an anchor when `as="a"`.
 */
import { forwardRef } from "react";

const base = [
  "inline-flex items-center justify-center gap-2",
  "font-sans font-semibold",
  "border transition-all",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50",
  "cursor-pointer select-none",
].join(" ");

const variants = {
  primary: [
    "bg-burgundy-600 text-white border-burgundy-600",
    "hover:bg-burgundy-700 hover:border-burgundy-700",
    "active:bg-burgundy-800",
    "shadow-brand hover:shadow-brand-lg",
  ].join(" "),

  secondary: [
    "bg-ivory-50 text-burgundy-600 border-burgundy-200",
    "hover:bg-burgundy-50 hover:border-burgundy-400",
    "active:bg-burgundy-100",
  ].join(" "),

  ghost: [
    "bg-transparent text-burgundy-600 border-transparent",
    "hover:bg-burgundy-50 hover:border-burgundy-100",
    "active:bg-burgundy-100",
  ].join(" "),

  danger: [
    "bg-transparent text-rose-600 border-rose-200",
    "hover:bg-rose-50 hover:border-rose-400",
    "active:bg-rose-100",
  ].join(" "),
};

const sizes = {
  sm: "text-xs px-3 py-1.5 rounded-base",
  md: "text-sm px-5 py-2.5 rounded-md",
  lg: "text-base px-7 py-3 rounded-md",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    className = "",
    children,
    as: Tag = "button",
    ...props
  },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={[base, variants[variant], sizes[size], className].join(" ")}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </Tag>
  );
});

export default Button;
