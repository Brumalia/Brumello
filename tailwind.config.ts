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
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
        serif: ["Instrument Serif", "ui-serif", "serif"],
      },
      fontSize: {
        'xs': ['0.6875rem', { lineHeight: '1rem' }],      // 11px - mono labels, small badges
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px - nav, buttons, section labels
        'base': ['0.875rem', { lineHeight: '1.5rem' }],   // 14px - body, card titles
        'lg': ['1rem', { lineHeight: '1.75rem' }],        // 16px
        'xl': ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px - metrics
        '4xl': ['3rem', { lineHeight: '1' }],             // 48px - page titles
        '5xl': ['4.5rem', { lineHeight: '1' }],           // 72px - hero text
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
