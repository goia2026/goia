import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        taupe: "#8A7665",
        ink: "#080807",
        porcelain: "#F8F7F4"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(138, 118, 101, 0.24)",
        glass: "0 20px 70px rgba(0, 0, 0, 0.22)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
