/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        valorant: {
          red: '#ff4655',
          dark: '#0f1923',
          darker: '#0a0f14',
          gray: '#ece8e1',
          accent: '#ece8e1',
        },
      },
    },
  },
  plugins: [],
}
