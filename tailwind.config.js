/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        background: 'var(--color-background)',
        text: 'var(--color-text)',
      }
    },
  },
  plugins: [],
}