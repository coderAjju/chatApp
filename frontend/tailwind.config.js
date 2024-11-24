/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

module.exports = {
  content: [
    "./index.html", // for Vite
    "./src/**/*.{js,jsx,ts,tsx}", // for React components
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui:{
    themes:["light",
"dark",
"cupcake",
"cyberpunk",
"garden",
"forest",
"lofi",
"pastel",
"fantasy",
"black",
"luxury",
"autumn",
"business",
"night",
"sunset",]
  }
};
