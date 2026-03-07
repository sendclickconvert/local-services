/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // EFP brand palette — [STUB] refine with Henry's brand review
        forest: {
          50:  '#f0f7f0',
          100: '#daeeda',
          500: '#2d5a2d',
          700: '#1a3c1a',
          900: '#0d1f0d',
        },
      },
    },
  },
  plugins: [],
};
