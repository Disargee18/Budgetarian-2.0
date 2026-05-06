/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          bg: "#000000",
          surface: "#050505",
          card: "rgba(12, 12, 12, 0.8)",
          border: "rgba(255, 255, 255, 0.05)",
          emerald: {
            DEFAULT: "#10B981",
            light: "#34D399",
            dark: "#059669",
            glow: "rgba(16, 185, 129, 0.15)",
          },
          amber: {
            DEFAULT: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706",
            glow: "rgba(245, 158, 11, 0.15)",
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#A1A1AA",
            muted: "#71717A",
          },
        },
      },
      borderRadius: {
        premium: '20px',
        'premium-lg': '28px',
        'premium-sm': '12px',
      },
      boxShadow: {
        'premium-glow': '0 0 20px rgba(16, 185, 129, 0.1)',
        'premium-card': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
        glass: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'gradient-premium': 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 40%), radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.05), transparent 40%)',
      }
    },
  },
  plugins: [],
}
