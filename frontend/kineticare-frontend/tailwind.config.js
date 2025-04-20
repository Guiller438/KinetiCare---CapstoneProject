/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        udla: {
          red: '#bb0a30',
          black: '#1a1a1a',
          gray: '#787878',
          light: '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
