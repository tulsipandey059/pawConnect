/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-beige': '#FAF3E0',
        'primary-orange': '#F4A261',
        'light-accent': '#FFD8A8',
        'text-dark': '#333333',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

