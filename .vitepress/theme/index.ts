import DefaultTheme from 'vitepress/theme';
import type { Theme, EnhanceAppContext } from 'vitepress';
import { h } from 'vue';
import { useData } from 'vitepress';

import ReaderShell from './components/ReaderShell.vue';
import ReaderSettings from './components/ReaderSettings.vue';
import ChapterNav from './components/ChapterNav.vue';
import TableOfContents from './components/TableOfContents.vue';
import SearchDialog from './components/SearchDialog.vue';
import SkeletonBlock from './components/SkeletonBlock.vue';
import ReaderNote from './components/ReaderNote.vue';
import ReaderLayout from './layouts/Reader.vue';

import './styles/main.css';
import './styles/custom.css';

const WrappedLayout = {
  setup() {
    const { frontmatter } = useData();
    return () => {
      if (frontmatter.value.layout === 'reader') {
        return h(ReaderLayout);
      }
      return h(DefaultTheme.Layout);
    };
  },
};

const theme: Theme = {
  extends: DefaultTheme,
  Layout: WrappedLayout,
  enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;
    app.component('ReaderShell', ReaderShell);
    app.component('ReaderSettings', ReaderSettings);
    app.component('ChapterNav', ChapterNav);
    app.component('TableOfContents', TableOfContents);
    app.component('SearchDialog', SearchDialog);
    app.component('SkeletonBlock', SkeletonBlock);
    app.component('ReaderNote', ReaderNote);
  },
};

export default theme;
