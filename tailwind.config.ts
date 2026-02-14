import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "brand-bg": "#0a0e27",
        "brand-surface": "#11152d",
        "brand-border": "#1a1f3a",
        "brand-green": "#00ff41",
        "brand-green-dim": "#00cc33",
        "brand-cyan": "#00d4ff",
        "brand-amber": "#ffa500",
      },
      fontFamily: {
        mono: ["DM Mono", "monospace"],
        serif: ["Instrument Serif", "serif"],
        sans: ["Satoshi", "sans-serif"],
      },
      backgroundColor: {
        DEFAULT: "#0a0e27",
      },
      textColor: {
        DEFAULT: "#ededed",
      },
      borderColor: {
        DEFAULT: "#1a1f3a",
      },
    },
  },
  plugins: [],
};

export default config;
