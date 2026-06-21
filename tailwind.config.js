/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        canvas: "#f6efe8",
        surface: "#f4dfca",
        ink: "#3a3636",
        muted: "#8a7d73",
        accent: "#ab7e57",
        danger: "#b55151",
      },
      fontFamily: {
        kalam: ["Kalam_400Regular"],
        "kalam-bold": ["Kalam_700Bold"],
        "kalam-light": ["Kalam_300Light"],
        jua: ["Jua_400Regular"],
      },
      boxShadow: {
        card: "0 16px 40px rgba(58, 54, 54, 0.12)",
        floating: "0 8px 24px rgba(58, 54, 54, 0.16)",
      },
    },
  },
};
