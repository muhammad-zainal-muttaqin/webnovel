<script setup lang="ts">
import { computed } from 'vue';
import { useData, useRoute } from 'vitepress';
import novels from '../../../novels.json';

type NovelMeta = {
  slug: string;
  chapters: Array<{ file: string; title: string; number: number }>;
};

const { frontmatter } = useData();
const route = useRoute();

const novel = computed<NovelMeta | undefined>(() =>
  (novels as NovelMeta[]).find((item) => item.slug === frontmatter.value.novel)
);

const chapterTitleMap = computed(() => {
  const map = new Map<string, string>();
  const novelMeta = novel.value;
  if (!novelMeta) return map;
  novelMeta.chapters.forEach((chapter) => {
    map.set(`./${chapter.file}`, chapter.title);
  });
  return map;
});

const basePath = computed(() => route.path.replace(/[^/]+$/, ''));

const resolveLink = (relative: unknown) => {
  if (typeof relative !== 'string' || !relative) {
    return null;
  }
  const normalized = relative.replace(/^\.\//, '').replace(/\.md$/, '');
  return `${basePath.value}${normalized}`;
};

const prevLink = computed(() => resolveLink(frontmatter.value.prev));
const nextLink = computed(() => resolveLink(frontmatter.value.next));

const prevLabel = computed(() => {
  if (typeof frontmatter.value.prev !== 'string') return '前へ';
  return chapterTitleMap.value.get(frontmatter.value.prev) ?? '前へ';
});

const nextLabel = computed(() => {
  if (typeof frontmatter.value.next !== 'string') return '次へ';
  return chapterTitleMap.value.get(frontmatter.value.next) ?? '次へ';
});
</script>

<template>
  <nav class="chapter-nav" aria-label="章ナビゲーション">
    <div class="chapter-nav__item">
      <a v-if="prevLink" class="chapter-nav__link" :href="prevLink">
        <span class="chapter-nav__hint">前の章</span>
        <span>{{ prevLabel }}</span>
      </a>
      <span v-else class="chapter-nav__link chapter-nav__link--disabled">
        <span class="chapter-nav__hint">前の章</span>
        <span>なし</span>
      </span>
    </div>
    <div class="chapter-nav__item">
      <a v-if="nextLink" class="chapter-nav__link chapter-nav__link--primary" :href="nextLink">
        <span class="chapter-nav__hint">次の章</span>
        <span>{{ nextLabel }}</span>
      </a>
      <span v-else class="chapter-nav__link chapter-nav__link--disabled">
        <span class="chapter-nav__hint">次の章</span>
        <span>なし</span>
      </span>
    </div>
  </nav>
</template>
