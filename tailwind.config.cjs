module.exports = {
  mode: "jit",
  // purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: "lexend",
      animation: {
        enter: "fadeInRight 300ms ease-out",
        leave: "fadeOutLeft 300ms ease-in forwards",
      },
      keyframes: {
        fadeInRight: {
          "0%": {
            opacity: "0",
            transform: "translate(2rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0)",
          },
        },
        fadeOutLeft: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      colors: {
        c_green: "#2C7A51",
        c_green_light: "#abcab9",
        c_yellow: "#FABC50",
        c_gray: "#A2B8AD",
        c_dark: "#20332A",
      },
    },
  },
  variants: {},
  plugins: [
    require("tailwindcss-textshadow"),
    require("tailwind-scrollbar-hide"),
  ],
};
