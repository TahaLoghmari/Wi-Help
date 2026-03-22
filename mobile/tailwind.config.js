/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#00394a",
        "brand-secondary": "#00546e",
        "brand-blue": "#3fa6ff",
        "brand-teal": "#14d3ac",
        "brand-light": "#00e984",
        "brand-cream": "#ffecb4",
        "brand-bg": "#fbfbfb",
      },
    },
  },
  plugins: [],
};
