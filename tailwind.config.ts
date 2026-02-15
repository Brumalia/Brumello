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
        base: '#0b1215',
        surface: '#101a1e',
        card: '#142024',
        'card-hover': '#182a2e',
        input: '#0e1619',
        'text-heading': '#f0f5f1',
        'text-primary': '#e2e8e4',
        'text-secondary': '#8a9b91',
        'text-muted': '#4d5f56',
        green: {
          50: 'rgba(52, 211, 153, 0.06)',
          100: 'rgba(52, 211, 153, 0.10)',
          200: 'rgba(52, 211, 153, 0.15)',
          400: '#34d399',
          500: '#10b981',
          600: '#059669'
        },
        status: {
          active: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
          idle: '#4d5f56'
        }
      },
      borderColor: {
        subtle: 'rgba(255, 255, 255, 0.04)',
        default: 'rgba(255, 255, 255, 0.07)',
        bright: 'rgba(255, 255, 255, 0.12)'
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
        md: '0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
        lg: '0 8px 30px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(52, 211, 153, 0.08)'
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'Consolas', 'monospace'],
        display: ['Instrument Serif', 'Georgia', 'serif']
      }
    },
  },
  plugins: [],
};

export default config;
