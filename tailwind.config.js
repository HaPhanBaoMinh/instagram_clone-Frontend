// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          '0%': { transform: 'scale(105%)' },
          '100%': { transform: 'scale(100%)' },
        },
        slice: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'waving-hand': 'wave 0.1s linear',
        'slicing-hand': 'slice 0.1s linear',
      },
    },
  },
  plugins: [],
}
