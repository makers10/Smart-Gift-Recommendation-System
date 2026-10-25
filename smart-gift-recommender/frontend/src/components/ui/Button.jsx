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
  "border transition-all duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69A55] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17131A]",
  "disabled:pointer-events-none disabled:opacity-50",
  "cursor-pointer select-none",
].join(" ");

const variants = {
  primary: [
    "bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] text-[#17131A] font-bold border-transparent",
    "hover:brightness-105 hover:shadow-[0_4px_20px_rgba(198,154,85,0.4)]",
    "active:scale-95",
  ].join(" "),

  gold: [
    "bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] text-[#17131A] font-bold border-transparent",
    "hover:brightness-105 hover:shadow-[0_4px_20px_rgba(198,154,85,0.4)]",
    "active:scale-95",
  ].join(" "),

  secondary: [
    "bg-[#241620] text-[#FFF7E9] border-[#4A1830]",
    "hover:bg-[#311C2C] hover:border-[#C69A55]/60 hover:text-[#C69A55]",
    "active:scale-95",
  ].join(" "),

  ghost: [
    "bg-transparent text-[#E9D7B8] border-transparent",
    "hover:bg-[#4A1830]/40 hover:text-[#FFF7E9]",
    "active:bg-[#4A1830]/60",
  ].join(" "),

  danger: [
    "bg-[#241620] text-rose-300 border-[#4A1830]",
    "hover:bg-rose-950/40 hover:border-rose-500/50 hover:text-rose-200",
    "active:scale-95",
  ].join(" "),
};

const sizes = {
  sm: "text-xs px-3.5 py-1.5 min-h-[36px] rounded-xl",
  md: "text-sm px-5 py-2.5 min-h-[44px] rounded-full",
  lg: "text-base px-7 py-3 min-h-[48px] rounded-full",
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
