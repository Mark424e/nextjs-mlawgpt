import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        text: '#7a7d8c',
        primary: '#C0A980',
        secondary: '#1F2435',
        gray: '#f3f3f3',
      },
    },
  },
  plugins: [],
} satisfies Config;
