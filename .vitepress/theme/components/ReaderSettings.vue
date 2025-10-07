<script setup lang="ts">
import { computed } from 'vue';
import { useReaderPreferences } from '../composables/useReaderPreferences';

const {
  theme,
  setTheme,
  fontScale,
  setFontScale,
  fontFamily,
  setFontFamily,
  lineHeight,
  setLineHeight,
  contentWidth,
  setContentWidth,
} = useReaderPreferences();

const fontScaleLabel = computed(() => {
  const value = fontScale.value;
  if (value === 0) return '標準';
  if (value > 0) return `拡大 +${value}`;
  return `縮小 ${value}`;
});
</script>

<template>
  <section class="reader-settings">
    <h2 class="reader-settings__title">表示設定</h2>

    <div class="reader-settings__group">
      <span class="reader-settings__label">テーマ</span>
      <div class="reader-settings__options">
        <button
          type="button"
          class="reader-settings__toggle"
          :class="{ 'reader-settings__toggle--active': theme === 'light' }"
          @click="setTheme('light')"
        >
          ライト
        </button>
        <button
          type="button"
          class="reader-settings__toggle"
          :class="{ 'reader-settings__toggle--active': theme === 'dark' }"
          @click="setTheme('dark')"
        >
          ダーク
        </button>
      </div>
    </div>

    <div class="reader-settings__group">
      <label class="reader-settings__label" for="reader-font-scale"> 文字サイズ </label>
      <input
        id="reader-font-scale"
        class="reader-settings__slider"
        type="range"
        min="-2"
        max="5"
        :value="fontScale"
        @input="setFontScale(Number(($event.target as HTMLInputElement).value))"
      />
      <p class="reader-settings__hint">{{ fontScaleLabel }}</p>
    </div>

    <div class="reader-settings__group">
      <label class="reader-settings__label" for="reader-font-family"> 書体 </label>
      <select
        id="reader-font-family"
        class="reader-settings__select"
        :value="fontFamily"
        @change="setFontFamily(($event.target as HTMLSelectElement).value as 'serif' | 'sans')"
      >
        <option value="serif">明朝体</option>
        <option value="sans">ゴシック体</option>
      </select>
    </div>

    <div class="reader-settings__group">
      <label class="reader-settings__label" for="reader-line-height"> 行間 </label>
      <select
        id="reader-line-height"
        class="reader-settings__select"
        :value="lineHeight"
        @change="
          setLineHeight(
            ($event.target as HTMLSelectElement).value as 'compact' | 'normal' | 'relaxed'
          )
        "
      >
        <option value="compact">狭い</option>
        <option value="normal">標準</option>
        <option value="relaxed">広い</option>
      </select>
    </div>

    <div class="reader-settings__group">
      <label class="reader-settings__label" for="reader-width"> 行幅 </label>
      <select
        id="reader-width"
        class="reader-settings__select"
        :value="contentWidth"
        @change="
          setContentWidth(
            ($event.target as HTMLSelectElement).value as 'narrow' | 'medium' | 'wide'
          )
        "
      >
        <option value="narrow">狭い</option>
        <option value="medium">標準</option>
        <option value="wide">広い</option>
      </select>
    </div>
  </section>
</template>
