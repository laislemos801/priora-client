import type { Config } from "tailwindcss"
import scrollbar from "tailwind-scrollbar"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Kode Mono", "monospace"],
      },
    },
  },
  plugins: [scrollbar],
} satisfies Config