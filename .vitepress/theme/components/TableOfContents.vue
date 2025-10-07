<script setup lang="ts">
import { computed } from 'vue';
import { useData, useRoute } from 'vitepress';
import { useI18n } from '../composables/useI18n';
import novels from '../../../novels.json';

type NovelMeta = {
  slug: string;
  chapters: Array<{ file: string; title: string; number: number }>;
};

const { frontmatter } = useData();
const route = useRoute();
const { t } = useI18n();

const novel = computed<NovelMeta | undefined>(() =>
  (novels as NovelMeta[]).find((item) => item.slug === frontmatter.value.novel)
);

const basePath = computed(() => route.path.replace(/[^/]+$/, ''));

const entries = computed(() => {
  const meta = novel.value;
  if (!meta) return [];

  return meta.chapters
    .slice()
    .sort((a, b) => a.number - b.number)
    .map((chapter) => {
      const path = `${basePath.value}${chapter.file.replace(/\.md$/, '')}`;
      const isCurrent = route.path.replace(/\/$/, '') === path.replace(/\/$/, '');
      return {
        ...chapter,
        path,
        isCurrent,
      };
    });
});
</script>

<template>
  <section class="toc">
    <h2 class="toc__title">{{ t('reader.tableOfContents') }}</h2>
    <ol class="toc__list">
      <li v-for="entry in entries" :key="entry.file" class="toc__item">
        <a :href="entry.path" class="toc__link" :class="{ 'toc__link--current': entry.isCurrent }">
          <span class="toc__number">{{ entry.number.toString().padStart(2, '0') }}</span>
          <span>{{ entry.title }}</span>
        </a>
      </li>
    </ol>
  </section>
</template>
