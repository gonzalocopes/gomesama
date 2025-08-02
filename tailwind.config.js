/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gomesamaRed: "#b9151b",  // rojo oscuro
        gomesamaBright: "#e01e26", // rojo brillante
        gomesamaGold: "#fbbf24", // dorado
        gomesamaWhite: "#ffffff"
      }
    },
  },
  plugins: [],
}
