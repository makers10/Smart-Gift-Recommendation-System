/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af",
          400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c",
        },
        blush: "#fdf2f8",
        petal: "#fce7f3",
        wine: "#9f1239",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Lato'", "sans-serif"],
      },
      backgroundImage: {
        "romantic": "linear-gradient(135deg, #fff1f2 0%, #fdf2f8 40%, #fce7f3 100%)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({ ".scrollbar-hide": { "-ms-overflow-style": "none", "scrollbar-width": "none", "&::-webkit-scrollbar": { display: "none" } } });
    },
  ],
};
