import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Solo Leveling theme colors
        'sl-dark': '#0a0e27',
        'sl-blue': '#1e3a8a',
        'sl-purple': '#6d28d9',
        'sl-gold': '#fbbf24',
        'sl-gray': '#374151',
        'sl-light': '#8b96a5',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'sl-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
