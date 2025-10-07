import { useData } from 'vitepress';
import { computed } from 'vue';

export const translations = {
  en: {
    reader: {
      settings: 'Display Settings',
      close: 'Close',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      fontSize: 'Font Size',
      fontFamily: 'Font Family',
      serif: 'Serif',
      sans: 'Sans Serif',
      lineHeight: 'Line Height',
      narrow: 'Narrow',
      normal: 'Normal',
      wide: 'Wide',
      contentWidth: 'Content Width',
      compact: 'Compact',
      relaxed: 'Relaxed',
      larger: 'Larger',
      smaller: 'Smaller',
      tableOfContents: 'Table of Contents',
      prevChapter: 'Previous Chapter',
      nextChapter: 'Next Chapter',
      previous: 'Previous',
      next: 'Next',
      notAvailable: 'Not available',
      search: 'Search',
      searchPlaceholder: 'Search chapters by title, keyword, or summary',
      loading: 'Loading index…',
      noResults: 'No matching chapters. Try a different keyword.',
      readingMode: 'Reading Mode',
      chapterNavigation: 'Chapter Navigation',
      library: 'Novels',
    },
  },
  id: {
    reader: {
      settings: 'Pengaturan Tampilan',
      close: 'Tutup',
      theme: 'Tema',
      light: 'Terang',
      dark: 'Gelap',
      fontSize: 'Ukuran Font',
      fontFamily: 'Jenis Font',
      serif: 'Serif',
      sans: 'Sans Serif',
      lineHeight: 'Jarak Baris',
      narrow: 'Sempit',
      normal: 'Normal',
      wide: 'Lebar',
      contentWidth: 'Lebar Konten',
      compact: 'Sempit',
      relaxed: 'Lebar',
      larger: 'Lebih Besar',
      smaller: 'Lebih Kecil',
      tableOfContents: 'Daftar Isi',
      prevChapter: 'Chapter Sebelumnya',
      nextChapter: 'Chapter Selanjutnya',
      previous: 'Sebelumnya',
      next: 'Selanjutnya',
      notAvailable: 'Tidak tersedia',
      search: 'Cari',
      searchPlaceholder: 'Cari chapter berdasarkan judul, kata kunci, atau ringkasan',
      loading: 'Memuat indeks…',
      noResults: 'Tidak ada chapter yang cocok. Coba kata kunci lain.',
      readingMode: 'Mode Baca',
      chapterNavigation: 'Navigasi Chapter',
      library: 'Novel',
    },
  },
};

export function useI18n() {
  const { lang } = useData();

  const locale = computed(() => {
    const currentLang = lang.value;
    return currentLang === 'id' ? 'id' : 'en';
  });

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[locale.value];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return {
    t,
    locale,
  };
}
