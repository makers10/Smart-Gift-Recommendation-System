import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gift with Love — The Right Gift, For Every Heart",
  description:
    "Luxury gifting discovery platform combining bespoke artisan commissions and AI-powered personalized gift recommendations.",
  keywords: [
    "gift recommendation",
    "luxury gifts",
    "custom made gifts",
    "thoughtful gifting",
    "bespoke artisans",
  ],
  authors: [{ name: "Gift with Love Atelier" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen bg-canvas text-stone-800 antialiased selection:bg-rose-200 selection:text-burgundy-900">
        {children}
      </body>
    </html>
  );
}
