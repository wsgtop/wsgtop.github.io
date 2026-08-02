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
      colors: {
        /* 前景色 / 后景色 / 边框色：统一从 CSS 变量取值，深浅模式自动切换 */
        'bg-canvas':   'var(--bg-canvas)',
        'bg-surface':  'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-muted':    'var(--bg-muted)',
        'fg-default':  'var(--fg-default)',
        'fg-muted':    'var(--fg-muted)',
        'fg-subtle':   'var(--fg-subtle)',
        'fg-disabled': 'var(--fg-disabled)',
        'border-default': 'var(--border-default)',
        'border-muted':   'var(--border-muted)',
        'glow-primary':   'var(--glow-primary)',
        'glow-secondary': 'var(--glow-secondary)',
      },
    },
  },
  plugins: [typography],
};
