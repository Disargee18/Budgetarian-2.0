/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          canvas: "#F4F1FA",
          surface: "#FFFFFF",
          cardBg: "rgba(255, 255, 255, 0.70)",
          foreground: "#1A171E",
          muted: "#524F59",
          border: "rgba(22, 163, 74, 0.12)",
          accent: "#16A34A",
          "accent-alt": "#15803D",
          sky: "#0EA5E9",
          green: "#16A34A",
          amber: "#F59E0B",
          red: "#EF4444",
          emerald: "#10B981",
        },
      },
      borderRadius: {
        'clay-sm': '20px',
        'clay-md': '24px',
        'clay-lg': '32px',
        'clay-xl': '48px',
        'clay-2xl': '60px',
      },
      boxShadow: {
        clayCard: '16px 16px 32px rgba(160, 150, 180, 0.20), -10px -10px 24px rgba(255, 255, 255, 0.90), inset 6px 6px 12px rgba(22, 163, 74, 0.03), inset -6px -6px 12px rgba(255, 255, 255, 1)',
        clayButton: '12px 12px 24px rgba(22, 163, 74, 0.30), -8px -8px 16px rgba(255, 255, 255, 0.40), inset 4px 4px 8px rgba(255, 255, 255, 0.40), inset -4px -4px 8px rgba(0, 0, 0, 0.10)',
        clayButtonHover: '16px 16px 32px rgba(22, 163, 74, 0.35), -10px -10px 20px rgba(255, 255, 255, 0.50), inset 4px 4px 8px rgba(255, 255, 255, 0.40), inset -4px -4px 8px rgba(0, 0, 0, 0.10)',
        clayPressed: 'inset 10px 10px 20px #d9d4e3, inset -10px -10px 20px #ffffff',
        clayDeep: '30px 30px 60px #cdc6d9, -30px -30px 60px #ffffff, inset 10px 10px 20px rgba(22, 163, 74, 0.05), inset -10px -10px 20px rgba(255, 255, 255, 0.80)',
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      backgroundImage: {
        'gradient-clay': 'linear-gradient(to bottom right, #4ADE80, #16A34A)',
        'gradient-income': 'linear-gradient(to bottom right, #4ADE80, #16A34A)',
        'gradient-expense': 'linear-gradient(to bottom right, #FCA5A5, #EF4444)',
        'gradient-savings': 'linear-gradient(to bottom right, #67E8F9, #0EA5E9)',
        'gradient-amber': 'linear-gradient(to bottom right, #FDE68A, #F59E0B)',
      }
    },
  },
  plugins: [],
}
