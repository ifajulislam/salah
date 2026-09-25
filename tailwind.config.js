/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        jade: "#0B4F3F",
        "jade-light": "#E1F5EE",
        sand: "#F7F2E9",
        surface: "#FFFFFF",
        ink: "#1B1B1B",
        "ink-muted": "#8A8577",
        hairline: "#EAE3D3",
        amber: "#F2B15A",
        danger: "#C24444",
      },
      fontFamily: {
        sans: ["PlusJakartaSans_500Medium"],
        "sans-semibold": ["PlusJakartaSans_600SemiBold"],
        "sans-bold": ["PlusJakartaSans_800ExtraBold"],
        arabic: ["NotoNaskhArabic_700Bold"],
      },
    },
  },
  plugins: [],
};
