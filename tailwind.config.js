module.exports = {
  darkMode: "class",
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        "brand-dark": "hsla(158, 23%, 18%, 1)",
        "brand-light": "hsla(160, 52%, 71%, 1)",
      },
      fontFamily: {
        gadey: ["Gadey", "sans-serif"],
        sfmono: ["SF-Mono", "monospace"],
        unytour: ["Unytour", "sans-serif"],
      },
      animation: {
        "zoom-in": "zoom 2s ease-out",
        "fade-in": "show 1s ease-in-out",
      },
      keyframes: {
        zoom: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        show: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
