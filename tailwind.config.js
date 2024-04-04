/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        greeny: "#99e265",
        greeny2: "#ade783",
        yellowy: "#fef952",
        yellowy2: "#fefa74",
      },
    },
  },
  plugins: [],
};
