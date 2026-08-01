import typography from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    './app/**/*.{vue,ts}',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        serif:['var(--font-serif)', ...defaultTheme.fontFamily.serif],
        mono:['var(--font-mono)', ...defaultTheme.fontFamily.mono],
        handwriting:['var(--font-handwriting)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [typography],
};
