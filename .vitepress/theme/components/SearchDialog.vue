<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue';

type SearchEntry = {
  route: string;
  title: string;
  summary: string;
  keywords: string[];
  novel: {
    slug: string;
    title: string;
  };
};

const open = ref(false);
const query = ref('');
const loading = ref(false);
const errorMessage = ref<string | null>(null);
const allEntries = ref<SearchEntry[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);

const normalise = (value: string) => value.toLowerCase();

const filteredEntries = computed(() => {
  const q = normalise(query.value.trim());
  if (!q) {
    return allEntries.value.slice(0, 12);
  }

  return allEntries.value
    .map((entry) => ({
      matchScore:
        (entry.title && normalise(entry.title).includes(q) ? 3 : 0) +
        (entry.novel.title && normalise(entry.novel.title).includes(q) ? 2 : 0) +
        (entry.summary && normalise(entry.summary).includes(q) ? 1 : 0) +
        (entry.keywords.some((keyword) => normalise(keyword).includes(q)) ? 1 : 0),
      entry,
    }))
    .filter((item) => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .map((item) => item.entry)
    .slice(0, 20);
});

const close = () => {
  open.value = false;
  query.value = '';
};

const loadEntries = async () => {
  if (allEntries.value.length > 0 || loading.value) {
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = null;

    const response = await fetch('/index.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = (await response.json()) as SearchEntry[];
    allEntries.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('[error] Failed to load search index', error);
    errorMessage.value = 'Unable to load search index. Please try again later.';
  } finally {
    loading.value = false;
  }
};

const openDialog = async () => {
  open.value = true;
  await loadEntries();
  await nextTick();
  inputRef.value?.focus();
};

const toggle = () => {
  if (open.value) {
    close();
  } else {
    void openDialog();
  }
};

const handleKey = (event: KeyboardEvent) => {
  if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    void openDialog();
  }

  if (event.key === 'Escape' && open.value) {
    event.preventDefault();
    close();
  }
};

const visit = (route: string) => {
  if (typeof window === 'undefined') return;
  window.location.href = route;
  close();
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKey);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKey);
  }
});

watch(open, (isOpen) => {
  if (!isOpen) {
    query.value = '';
  }
});
</script>

<template>
  <div class="search-dialog">
    <button type="button" class="search-dialog__trigger" @click="toggle">
      Search<span aria-hidden="true"> (/)</span>
    </button>

    <transition name="search-dialog__overlay">
      <div v-if="open" class="search-dialog__overlay">
        <div class="search-dialog__panel" role="dialog" aria-modal="true" aria-label="Search">
          <form
            class="search-dialog__header"
            @submit.prevent="filteredEntries[0] && visit(filteredEntries[0].route)"
          >
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              placeholder="Search chapters by title, keyword, or summary"
              class="search-dialog__input"
              spellcheck="false"
              autocomplete="off"
            />
            <button type="button" class="search-dialog__close" @click="close">Close</button>
          </form>

          <div class="search-dialog__body">
            <div v-if="loading" class="search-dialog__status">Loading index�</div>
            <div v-else-if="errorMessage" class="search-dialog__error">{{ errorMessage }}</div>
            <div v-else-if="filteredEntries.length === 0" class="search-dialog__status">
              No matching chapters. Try a different keyword.
            </div>
            <ul v-else class="search-dialog__results">
              <li v-for="entry in filteredEntries" :key="entry.route" class="search-dialog__result">
                <button
                  type="button"
                  class="search-dialog__result-link"
                  @click="visit(entry.route)"
                >
                  <span class="search-dialog__result-title">{{ entry.title }}</span>
                  <span class="search-dialog__result-novel">{{ entry.novel.title }}</span>
                  <span class="search-dialog__result-summary">{{ entry.summary }}</span>
                  <span v-if="entry.keywords.length" class="search-dialog__result-tags">
                    <span
                      v-for="keyword in entry.keywords"
                      :key="keyword"
                      class="search-dialog__tag"
                      >{{ keyword }}</span
                    >
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
