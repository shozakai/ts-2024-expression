// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // 本番環境のURLに変更してください
  integrations: [tailwind(), icon()],
  vite: {
    plugins: [tsconfigPaths()],
  },
});
