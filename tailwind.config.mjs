/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        paper:     '#FAF9F6',
        'paper-2': '#F1EFE9',
        rule:      '#DEDAD0',
        ink:       '#1A1A17',
        'ink-2':   '#5A574E',
        accent:    '#8A2B1B',
      },
      fontFamily: {
        sans:  ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        mono:  ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        micro:   ['0.75rem',   { lineHeight: '1.4',  letterSpacing: '0.08em' }],
        small:   ['0.875rem',  { lineHeight: '1.5' }],
        base:    ['1.0625rem', { lineHeight: '1.65' }],
        h3:      ['1.125rem',  { lineHeight: '1.4',  letterSpacing: '-0.005em' }],
        lead:    ['1.25rem',   { lineHeight: '1.5',  letterSpacing: '-0.005em' }],
        h2:      ['1.5rem',    { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h1:      ['2.25rem',   { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        display: ['clamp(2.25rem, 1.5rem + 3vw, 3rem)',
                               { lineHeight: '1.08', letterSpacing: '-0.03em' }],
      },
      spacing: {
        gutter:    '1.5rem',
        'stack-1': '0.75rem',
        'stack-2': '1.5rem',
        'stack-3': '3rem',
        'stack-4': '6rem',
      },
      maxWidth: {
        prose:  '62ch',
        widest: '76ch',
      },
      borderRadius: {
        DEFAULT: '2px',
        none:    '0',
      },
      borderWidth: {
        hair: '1px',
      },
    },
  },
  plugins: [],
};