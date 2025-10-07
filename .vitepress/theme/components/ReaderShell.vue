<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useData } from 'vitepress';

import { useReaderPreferences } from '../composables/useReaderPreferences';
import { useI18n } from '../composables/useI18n';
import novels from '../../../novels.json';

import ReaderSettings from './ReaderSettings.vue';
import ChapterNav from './ChapterNav.vue';
import TableOfContents from './TableOfContents.vue';
import SearchDialog from './SearchDialog.vue';

type NovelMeta = {
  slug: string;
  title: string;
  description?: string;
  chapters: Array<{
    file: string;
    title: string;
    number: number;
  }>;
};

const { frontmatter } = useData();
const { theme, fontScale, fontFamily, lineHeight, contentWidth } = useReaderPreferences();
const { t } = useI18n();

const resolvedNovel = computed<NovelMeta | undefined>(() =>
  (novels as NovelMeta[]).find((item) => item.slug === frontmatter.value.novel)
);

const chapterTitle = computed(() => frontmatter.value.title ?? '');
const novelTitle = computed(() => resolvedNovel.value?.title ?? t('reader.readingMode'));

const settingsOpen = ref(false);
const isDesktop = ref(false);

const updateDesktopMatch = () => {
  if (typeof window === 'undefined') return;
  const matches = window.matchMedia('(min-width: 960px)').matches;
  isDesktop.value = matches;
  if (matches) {
    settingsOpen.value = false;
  }
};

let mediaQuery: MediaQueryList | null = null;

onMounted(() => {
  if (typeof window === 'undefined') return;
  mediaQuery = window.matchMedia('(min-width: 960px)');
  updateDesktopMatch();
  mediaQuery.addEventListener('change', updateDesktopMatch);
});

onBeforeUnmount(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', updateDesktopMatch);
  }
});

const shellClass = computed(() => {
  const scale = fontScale.value;
  const scaleClass =
    scale >= 0
      ? `reader-shell--font-scale-p${scale}`
      : `reader-shell--font-scale-n${Math.abs(scale)}`;
  return [
    'reader-shell',
    `reader-shell--theme-${theme.value}`,
    `reader-shell--font-${fontFamily.value}`,
    scaleClass,
    `reader-shell--line-${lineHeight.value}`,
    `reader-shell--width-${contentWidth.value}`,
  ];
});

const toggleSettings = () => {
  if (isDesktop.value) {
    return;
  }
  settingsOpen.value = !settingsOpen.value;
};
</script>

<template>
  <div :class="shellClass">
    <header class="reader-shell__header">
      <div class="reader-shell__titles">
        <a href="/" class="reader-shell__back">← Home</a>
        <p class="reader-shell__novel">{{ novelTitle }}</p>
        <h1 class="reader-shell__chapter">{{ chapterTitle }}</h1>
      </div>
      <div class="reader-shell__actions">
        <button type="button" class="reader-shell__action" @click="toggleSettings">{{ t('reader.settings') }}</button>
        <SearchDialog />
      </div>
    </header>

    <div class="reader-shell__layout">
      <aside v-if="isDesktop" class="reader-shell__sidebar">
        <ReaderSettings />
        <TableOfContents />
      </aside>

      <main class="reader-shell__content">
        <slot />
      </main>
    </div>

    <footer class="reader-shell__footer">
      <ChapterNav />
    </footer>

    <transition name="reader-shell__drawer">
      <div v-if="settingsOpen && !isDesktop" class="reader-shell__drawer">
        <div class="reader-shell__drawer-backdrop" @click="toggleSettings" />
        <div class="reader-shell__drawer-panel">
          <div class="reader-shell__drawer-header">
            <h2>{{ t('reader.settings') }}</h2>
            <button type="button" class="reader-shell__action" @click="toggleSettings">
              {{ t('reader.close') }}
            </button>
          </div>
          <ReaderSettings />
          <TableOfContents />
        </div>
      </div>
    </transition>
  </div>
</template>
