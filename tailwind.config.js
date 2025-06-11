/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        SpaceMono: ["SpaceMo-no", "sans-serif"],
        Poppins: ["Poppins-Regular", "sans-serif"],
        PoppinsBold: ["Poppins-Bold", "sans-serif"],
        PoppinsExtraBold: ["Poppins-ExtraBold", "sans-serif"],
        PoppinsExtraLight: ["Poppins-ExtraLight", "sans-serif"],
        PoppinsLight: ["Poppins-Light", "sans-serif"],
        PoppinsMedium: ["Poppins-Medium", "sans-serif"],
        PoppinsSemibold: ["Poppins-Semibold", "sans-serif"],
        PoppinsThin: ["Poppins-Thin", "sans-serif"],
      },
      colors: {
        primary: "#030014",
        secondary: "#151312",
        light: {
          100: "#D6C7FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#221F3D",
          200: "#0F0D23",
        },
        accent: "#AB8BFF",
      },
    },
  },
  plugins: [],
};
