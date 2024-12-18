/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          "100": "hsl(var(--success-100))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          "100": "hsl(var(--info-100))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          "100": "hsl(var(--warning-100))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          "100": "hsl(var(--danger-100))",
        },
        draft: {
          DEFAULT: "hsl(var(--draft))",
          "100": "hsl(var(--draft-100))",
        },
        progress: {
          DEFAULT: "hsl(var(--progress))",
          "100": "hsl(var(--progress-100))",
        },
        "status-foreground": {
          DEFAULT: "hsl(var(--status-foreground))",
        },
      },
      width: {
        "1/8": "12.5%",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
        foreground: "hsl(var(--primary))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
