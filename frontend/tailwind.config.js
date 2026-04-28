/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 20px 60px rgba(37, 99, 235, 0.18)",
      },
    },
  },
  plugins: [],
}
