<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const open = ref(false);
const query = ref('');

const toggle = () => {
  open.value = !open.value;
  if (!open.value) {
    query.value = '';
  }
};

const close = () => {
  open.value = false;
  query.value = '';
};

const handleKey = (event: KeyboardEvent) => {
  if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    open.value = true;
  }
  if (event.key === 'Escape') {
    close();
  }
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
</script>

<template>
  <div class="search-dialog">
    <button type="button" class="search-dialog__trigger" @click="toggle">
      検索<span aria-hidden="true">（/）</span>
    </button>

    <transition name="search-dialog__overlay">
      <div v-if="open" class="search-dialog__overlay">
        <div class="search-dialog__panel" role="dialog" aria-modal="true" aria-label="検索">
          <div class="search-dialog__header">
            <input
              v-model="query"
              type="search"
              placeholder="キーワードで章を検索（準備中）"
              class="search-dialog__input"
              autofocus
            />
            <button type="button" class="search-dialog__close" @click="close">閉じる</button>
          </div>
          <p class="search-dialog__hint">
            近日中にローカル検索を実装予定です。それまでは目次から移動してください。
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
