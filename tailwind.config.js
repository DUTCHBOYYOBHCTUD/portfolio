/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#000000',
        'cyber-white': '#ffffff',
        'cyber-gray': '#808080',
        'cyber-dark-gray': '#333333',
        'cyber-light-gray': '#cccccc',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Playfair Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
