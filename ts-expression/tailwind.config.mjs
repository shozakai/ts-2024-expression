/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  corePlugins: {
    // 自作のreset.scssを使用するためPreflightを無効化
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        'public-sans': ['Public Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'graphyne': ['Graphyne', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'sans': ['Public Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'], // デフォルトサンセリフ
      },
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      fontSize: {
        'text-s': ['1.4rem', '1.3'],
        'text-s-b': ['1.4rem', '1.6'],
        'text-l-b': ['2.4rem', '1.6'],
        'text-h2': ['10rem', '1.3'],
      },
      colors: {
        'text-white': '#ffffff',
        'text-black': '#111111',
      },
      backgroundColor: {
        'bg-white': '#ffffff',
        'bg-black': '#111111',
      }
    },
  },
  plugins: [],
}