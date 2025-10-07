import { defineConfig } from 'vitepress';

export default defineConfig({
  srcDir: 'content',
  lang: 'ja-JP',
  title: 'Web Novel Platform',
  description: 'Reading experience tailored for long-form fiction.',
  rewrites: {
    'novels/:slug/:chapter': 'novel/:slug/:chapter',
  },
  lastUpdated: false,
  themeConfig: {
    nav: [],
    outline: false,
    search: {
      provider: 'local',
    },
  },
});
