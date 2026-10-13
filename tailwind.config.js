/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F19',
          card: '#111827',
          surface: '#1F2937',
          border: '#374151',
          oil: '#F59E0B',      // Warm golden oil
          oilLight: '#FDE68A',
          oilDark: '#B45309',
          neon: '#06B6D4',     // Cyan performance
          accent: '#2563EB',   // Electric blue
          success: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-oil': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'glow-neon': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
      }
    },
  },
  plugins: [],
}
