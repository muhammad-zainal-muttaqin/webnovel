import { defineConfig } from 'vitepress';

export default defineConfig({
  srcDir: 'content',
  title: 'Web Novel Platform',
  description: 'Reading experience tailored for long-form fiction.',
  rewrites: {
    'novels/:slug/:chapter': 'novel/:slug/:chapter',
  },
  lastUpdated: false,

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Novels', link: '/novels' },
        ],
        docFooter: {
          prev: 'Previous',
          next: 'Next',
        },
      },
    },
    id: {
      label: 'Indonesia',
      lang: 'id',
      link: '/id/',
      themeConfig: {
        nav: [
          { text: 'Beranda', link: '/id/' },
          { text: 'Novel', link: '/id/novels' },
        ],
        docFooter: {
          prev: 'Sebelumnya',
          next: 'Selanjutnya',
        },
      },
    },
  },

  themeConfig: {
    outline: false,
    search: {
      provider: 'local',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
  },

  vite: {
    server: {
      port: 3000,
      host: '127.0.0.1',
    },
  },
  appearance: 'dark',
  cleanUrls: true,
});
