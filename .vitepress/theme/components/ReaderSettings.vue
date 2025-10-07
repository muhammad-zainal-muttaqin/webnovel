<script setup lang="ts">
import { computed } from 'vue';
import { useReaderPreferences } from '../composables/useReaderPreferences';
import { useI18n } from '../composables/useI18n';

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

const { t } = useI18n();

const fontScaleLabel = computed(() => {
  const value = fontScale.value;
  if (value === 0) return t('reader.normal');
  if (value > 0) return `${t('reader.larger')} +${value}`;
  return `${t('reader.smaller')} ${value}`;
});
</script>

<template>
  <section class="reader-settings">
    <h2 class="reader-settings__title">{{ t('reader.settings') }}</h2>

    <div class="reader-settings__group">
      <span class="reader-settings__label">{{ t('reader.theme') }}</span>
      <div class="reader-settings__options">
        <button
          type="button"
          class="reader-settings__toggle"
          :class="{ 'reader-settings__toggle--active': theme === 'light' }"
          @click="setTheme('light')"
        >
          {{ t('reader.light') }}
        </button>
        <button
          type="button"
          class="reader-settings__toggle"
          :class="{ 'reader-settings__toggle--active': theme === 'dark' }"
          @click="setTheme('dark')"
        >
          {{ t('reader.dark') }}
        </button>
      </div>
    </div>

    <div class="reader-settings__group">
      <label class="reader-settings__label" for="reader-font-scale">
        {{ t('reader.fontSize') }}
      </label>
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
      <label class="reader-settings__label" for="reader-font-family">
        {{ t('reader.fontFamily') }}
      </label>
      <select
        id="reader-font-family"
        class="reader-settings__select"
        :value="fontFamily"
        @change="setFontFamily(($event.target as HTMLSelectElement).value as 'serif' | 'sans')"
      >
        <option value="serif">{{ t('reader.serif') }}</option>
        <option value="sans">{{ t('reader.sans') }}</option>
      </select>
    </div>

    <div class="reader-settings__group">
      <label class="reader-settings__label" for="reader-line-height">
        {{ t('reader.lineHeight') }}
      </label>
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
        <option value="compact">{{ t('reader.compact') }}</option>
        <option value="normal">{{ t('reader.normal') }}</option>
        <option value="relaxed">{{ t('reader.relaxed') }}</option>
      </select>
    </div>

    <div class="reader-settings__group">
      <label class="reader-settings__label" for="reader-width">
        {{ t('reader.contentWidth') }}
      </label>
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
        <option value="narrow">{{ t('reader.narrow') }}</option>
        <option value="medium">{{ t('reader.normal') }}</option>
        <option value="wide">{{ t('reader.wide') }}</option>
      </select>
    </div>
  </section>
</template>
