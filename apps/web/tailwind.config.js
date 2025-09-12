/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2A62FF", // primary
          dark: "#1B3CB0",
          light: "#5C8CFF",
          muted: "#A3B8FF", // for subtle accents
        },
        surface: {
          DEFAULT: "#0D0F14", // base background
          light: "#1A1D25", // card backgrounds
          dark: "#07080B", // extra contrast
        },
        text: {
          DEFAULT: "#E4E6EB", // body text
          muted: "#9CA3AF", // secondary text
          subtle: "#6B7280", // hint text / placeholders
        },
        accent: {
          success: "#4ADE80",
          warning: "#FACC15",
          danger: "#F87171",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
        logo: ["Lavishly Yours", "cursive"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
