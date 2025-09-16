/** @type {import('tailwindcss').Config} */
import { myColors } from './src/constants';

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
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
        GlittherSyavinafree: ["GlittherSyavinafree", "sans-serif"],
      },
      colors: myColors
    },
  },
  plugins: [],
};
