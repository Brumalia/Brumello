import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Backgrounds - warmer, layered
        "bg-primary": "#0c0d12",
        "bg-surface": "#13141a",
        "bg-card": "#191a22",
        "bg-hover": "#1e1f28",
        
        // Brand accents - softened
        "brand-green": "#00e85c",
        "brand-green-dim": "#00c44e",
        "brand-green-glow": "rgba(0, 232, 92, 0.08)",
        "brand-green-glow-strong": "rgba(0, 232, 92, 0.15)",
        "brand-cyan": "#00d4ff",
        "brand-amber": "#f5a623",
        "brand-red": "#ef4444",
        "brand-blue": "#6366f1",
        
        // Borders - opacity-based
        "border-default": "rgba(255, 255, 255, 0.06)",
        "border-bright": "rgba(255, 255, 255, 0.10)",
        "border-focus": "rgba(0, 232, 92, 0.3)",
        
        // Text
        "text-primary": "#e8e8e8",
        "text-secondary": "#8a8a9a",
        "text-muted": "#4a4a5a",
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
        DEFAULT: "#0c0d12",
      },
      textColor: {
        DEFAULT: "#e8e8e8",
      },
      borderColor: {
        DEFAULT: "rgba(255, 255, 255, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
