import { reactive, watch, toRefs } from 'vue';

type ThemeMode = 'light' | 'dark';
type FontFamily = 'serif' | 'sans';
type LineHeight = 'compact' | 'normal' | 'relaxed';
type ContentWidth = 'narrow' | 'medium' | 'wide';

export type ReaderPreferences = {
  theme: ThemeMode;
  fontScale: number;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  contentWidth: ContentWidth;
  ready: boolean;
};

const STORAGE_KEY = 'webnovel-reader-preferences-v1';

const defaultPreferences: ReaderPreferences = {
  theme: 'light',
  fontScale: 0,
  fontFamily: 'serif',
  lineHeight: 'normal',
  contentWidth: 'medium',
  ready: false,
};

const state = reactive<ReaderPreferences>({ ...defaultPreferences });

const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.readerTheme = theme;
};

const isThemeMode = (value: unknown): value is ThemeMode => value === 'light' || value === 'dark';
const isFontFamily = (value: unknown): value is FontFamily => value === 'serif' || value === 'sans';
const isLineHeight = (value: unknown): value is LineHeight =>
  value === 'compact' || value === 'normal' || value === 'relaxed';
const isContentWidth = (value: unknown): value is ContentWidth =>
  value === 'narrow' || value === 'medium' || value === 'wide';

const loadPreferences = () => {
  if (typeof window === 'undefined') return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (isThemeMode(parsed.theme)) {
      state.theme = parsed.theme;
    }
    if (typeof parsed.fontScale === 'number' && Number.isFinite(parsed.fontScale)) {
      state.fontScale = Math.max(-2, Math.min(5, Math.round(parsed.fontScale)));
    }
    if (isFontFamily(parsed.fontFamily)) {
      state.fontFamily = parsed.fontFamily;
    }
    if (isLineHeight(parsed.lineHeight)) {
      state.lineHeight = parsed.lineHeight;
    }
    if (isContentWidth(parsed.contentWidth)) {
      state.contentWidth = parsed.contentWidth;
    }
  } catch {
    Object.assign(state, { ...defaultPreferences });
  }
};

if (typeof window !== 'undefined') {
  loadPreferences();
  state.ready = true;

  const persist = () => {
    const payload = {
      theme: state.theme,
      fontScale: state.fontScale,
      fontFamily: state.fontFamily,
      lineHeight: state.lineHeight,
      contentWidth: state.contentWidth,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    applyThemeToDocument(state.theme);
  };

  persist();

  watch(
    () =>
      [
        state.theme,
        state.fontScale,
        state.fontFamily,
        state.lineHeight,
        state.contentWidth,
      ] as const,
    persist,
    { immediate: false }
  );
} else {
  applyThemeToDocument(state.theme);
}

export const useReaderPreferences = () => {
  const setTheme = (theme: ThemeMode) => {
    state.theme = theme;
  };

  const setFontScale = (scale: number) => {
    state.fontScale = Math.max(-2, Math.min(5, Math.round(scale)));
  };

  const setFontFamily = (family: FontFamily) => {
    state.fontFamily = family;
  };

  const setLineHeight = (value: LineHeight) => {
    state.lineHeight = value;
  };

  const setContentWidth = (value: ContentWidth) => {
    state.contentWidth = value;
  };

  return {
    ...toRefs(state),
    setTheme,
    setFontScale,
    setFontFamily,
    setLineHeight,
    setContentWidth,
  };
};
