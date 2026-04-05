export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px",
        6: "48px",
        8: "64px",
      },
      colors: {
        white: "#FFFFFF",
        black: "#000000",
      },
      lineHeight: {
        relaxed: "1.75",
        normal: "1.5",
      },
      letterSpacing: {
        normal: "0",
        tight: "-0.02em",
      },
    },
  },
  plugins: [],
};
