/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          canvas:    "#F2F7F0",
          fg:        "#1E2D1F",
          muted:     "#4A5E4B",
          primary:   "#27500A",
          mid:       "#3B6D11",
          light:     "#639922",
          secondary: "#BA7517",
          secMid:    "#854F0B",
          secLight:  "#EF9F27",
          card:      "rgba(255,255,255,0.65)",
        },
      },
      borderRadius: {
        clay:    "32px",
        clayLg:  "48px",
        clayXl:  "60px",
        clayMd:  "24px",
        claySm:  "20px",
      },
      boxShadow: {
        clayCard:
          "16px 16px 32px rgba(39,80,10,0.12), -10px -10px 24px rgba(255,255,255,0.9), inset 6px 6px 12px rgba(59,109,17,0.04), inset -6px -6px 12px rgba(255,255,255,1)",
        clayButton:
          "10px 10px 20px rgba(39,80,10,0.25), -6px -6px 14px rgba(255,255,255,0.4), inset 4px 4px 8px rgba(255,255,255,0.35), inset -4px -4px 8px rgba(0,0,0,0.08)",
        clayButtonHover:
          "14px 14px 28px rgba(39,80,10,0.3), -8px -8px 18px rgba(255,255,255,0.5), inset 4px 4px 8px rgba(255,255,255,0.4), inset -4px -4px 8px rgba(0,0,0,0.1)",
        clayPressed:
          "inset 10px 10px 20px rgba(180,200,170,0.5), inset -10px -10px 20px rgba(255,255,255,0.9)",
      },
      fontFamily: {
        heading: ["Nunito", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
