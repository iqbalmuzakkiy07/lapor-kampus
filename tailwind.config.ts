import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          darkest: "#051F20",
          deep: "#0B2B26",
          DEFAULT: "#163832",
          teal: "#235347",
          sage: "#8EB69B",
          mint: "#DAF1DE",
        },
        surface: "#FFFFFF",
        muted: "#526B61",
        status: {
          success: "#235347",
          warning: "#8A6418",
          danger: "#B42318",
          info: "#235347",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "18px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 4px 16px rgba(5, 31, 32, 0.08)",
        popover: "0 12px 32px rgba(5, 31, 32, 0.16)",
      },
      minHeight: {
        control: "44px",
      },
      minWidth: {
        control: "44px",
      },
    },
  },
  plugins: [],
};

export default config;

