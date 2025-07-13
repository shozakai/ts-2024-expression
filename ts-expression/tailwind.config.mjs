/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  corePlugins: {
    // 自作のreset.scssを使用するためPreflightを無効化
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
} 