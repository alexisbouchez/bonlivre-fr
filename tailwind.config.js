const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        serif: ["EB Garamond"],
      },
      colors: {
        opium: {
          DEFAULT: "#54907B",
          50: "#C1DBD2",
          100: "#B4D3C8",
          200: "#9AC4B5",
          300: "#80B5A3",
          400: "#67A690",
          500: "#365C4F",
          600: "#213931",
          700: "#2B493E",
          800: "#162620",
          900: "#010202",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
