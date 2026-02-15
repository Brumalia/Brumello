import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Backgrounds - monochromatic green-tinted
        "bg-base": "#0b1215",      // deepest layer - near-black with green undertone
        "bg-surface": "#101a1e",   // sidebar, panels - dark forest
        "bg-card": "#142024",      // cards, elevated surfaces
        "bg-card-hover": "#182a2e", // card hover state
        "bg-input": "#0e1619",     // input fields, slightly recessed
        
        // Brand accents - emerald palette
        "brand-green": "#34d399",  // emerald-400 - primary accent
        "brand-green-dim": "#10b981", // emerald-500 - secondary
        "brand-green-dark": "#059669", // emerald-600 - pressed states
        "green-50": "rgba(52, 211, 153, 0.06)",   // ghost bg
        "green-100": "rgba(52, 211, 153, 0.10)",  // subtle badge backgrounds
        "green-200": "rgba(52, 211, 153, 0.15)",  // stronger badge / active state
        
        // Status colors - muted to match palette
        "status-active": "#34d399",  // emerald green
        "status-warning": "#fbbf24", // warm amber
        "status-error": "#f87171",   // soft red
        "status-info": "#60a5fa",    // soft blue
        "status-idle": "#4d5f56",    // muted
        
        // Legacy color mappings for compatibility
        "brand-cyan": "#00d4ff",
        "brand-amber": "#f5a623",
        "brand-red": "#ef4444",
        "brand-blue": "#6366f1",
        
        // Borders - opacity-based (refined)
        "border-subtle": "rgba(255, 255, 255, 0.04)",  // barely there
        "border-default": "rgba(255, 255, 255, 0.07)", // standard borders
        "border-bright": "rgba(255, 255, 255, 0.12)",  // hover/focus borders
        "border-focus": "rgba(52, 211, 153, 0.3)",     // emerald focus
        
        // Text - green-tinted
        "text-primary": "#e2e8e4",   // slightly green-tinted white
        "text-secondary": "#8a9b91", // muted green-grey
        "text-muted": "#4d5f56",     // labels, timestamps
        "text-heading": "#f0f5f1",   // brighter for headings
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
        'lg': '0 8px 30px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(52, 211, 153, 0.08)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
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
        DEFAULT: "#0b1215",  // bg-base
      },
      textColor: {
        DEFAULT: "#e2e8e4",  // text-primary
      },
      borderColor: {
        DEFAULT: "rgba(255, 255, 255, 0.07)",  // border-default
      },
    },
  },
  plugins: [],
};

export default config;
