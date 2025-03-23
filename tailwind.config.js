const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./public/**/*.{html,js,tsx,jsx,ts}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        1: "1 1 0%",
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
