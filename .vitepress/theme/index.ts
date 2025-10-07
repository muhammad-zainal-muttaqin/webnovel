import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import ReaderShell from './components/ReaderShell.vue';
import ReaderSettings from './components/ReaderSettings.vue';
import ChapterNav from './components/ChapterNav.vue';
import TableOfContents from './components/TableOfContents.vue';
import SearchDialog from './components/SearchDialog.vue';
import SkeletonBlock from './components/SkeletonBlock.vue';
import ReaderNote from './components/ReaderNote.vue';

import './styles/main.css';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
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
