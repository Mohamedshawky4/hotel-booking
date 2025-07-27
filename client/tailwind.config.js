/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <== make sure this line is present
  ],
  theme: {
   extend: {
      fontFamily: {
        playfair: ['"Playfair"', 'serif'],
        outfit: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
