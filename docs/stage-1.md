# Stage 1 Playbook - Static Reader MVP (VitePress)

Dokumen ini menjadi referensi kerja Tahap 1: menyiapkan pengalaman membaca statis dengan konten Markdown dan deploy ke platform SSG.

## Sasaran Tahap 1

- Rilis halaman baca yang nyaman dengan kontrol tampilan lengkap (light/dark, font, ukuran, spacing, lebar).
- Pastikan seluruh chapter bisa diakses melalui struktur Markdown plus navigasi prev/next tanpa error.
- Bangun komponen dan struktur proyek yang siap direuse saat memasuki Tahap 2 (sinkronisasi API).

## Struktur Konten

- Folder utama: `content/novels/<slug>/chapter-XXX.md`.
- Metadata global novel: `novels.json` (judul, author, cover, status, tags, deskripsi singkat).
- Skrip validasi (`scripts/validate-content.ts`) mengecek:
  - Frontmatter wajib (id, novel, chapter, title, prev, next, summary, keywords, releaseDate).
  - Konsistensi penomoran chapter.
  - Tautan prev/next valid.
  - Duplikasi `id` atau `chapter`.

## Komponen dan Theme

Semua komponen disimpan di `.vitepress/theme`.

| Komponen              | Fungsi utama                                            | Catatan                                               |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| `ReaderShell.vue`     | Layout halaman baca, header, konten, footer             | Menggunakan slot untuk isi chapter                    |
| `ReaderSettings.vue`  | Panel kontrol tampilan (font, size, spacing, dark mode) | Preferensi disimpan via helper `useReaderPreferences` |
| `ChapterNav.vue`      | Tombol prev/next, progress bar, info chapter            | Ambil metadata prev/next dari frontmatter             |
| `TableOfContents.vue` | Daftar isi novel                                        | Mengonsumsi data dari `novels.json` + metadata bab    |
| `SearchDialog.vue`    | Pencarian cepat                                         | Mengonsumsi indeks statis `public/index.json`         |
| `SkeletonBlock.vue`   | Loading state generik                                   | Digunakan saat data belum tersedia                    |
| `ReaderNote.vue`      | Komponen highlight/blockquote                           | Dipanggil dalam Markdown                              |

### Composable dan Store

- `useReaderPreferences` � membaca & menyimpan preferensi ke `localStorage` dengan fallback default.
- `store/index.ts` � titik ekspor composable untuk preferensi pembaca.

### Konfigurasi VitePress

- `vitepress.config.ts`
  - `srcDir: "content"`.
  - `rewrites` memetakan `novels/<slug>/<chapter>` menjadi `/novel/<slug>/<chapter>`.
  - `themeConfig` menonaktifkan outline default dan mendaftarkan komponen reader.
- Skrip pendukung:
  - `scripts/build-search-index.ts` menghasilkan indeks pencarian (`public/index.json`).
  - `scripts/validate-content.ts` memastikan frontmatter dan relasi antar chapter valid.

## Build dan Deploy

- Workflow GitHub Actions (`.github/workflows/check.yml`):
  1. Checkout dan install dependency (`npm install`).
  2. Jalankan `npm run check` (lint + typecheck + validator konten).
  3. (Opsional) `npm run docs:build` sebelum deploy ke Cloudflare Pages/Vercel/GitHub Pages.
- Lokal:
  - `npm run docs:dev` menjalankan VitePress dev server setelah regenerasi indeks.
  - `npm run docs:build` membangun output statis (memanggil `npm run generate:search`).

## Quality Gate Manual

- `npm run check` harus lolos sebelum merge.
- Audit Lighthouse manual (desktop & mobile) dan catat di `docs/audit.md`.
- Baca sampel chapter di versi deployed untuk verifikasi:
  - Navigasi prev/next berfungsi.
  - Pengaturan light/dark tersimpan dan diterapkan ulang saat reload.
  - Pencarian menampilkan hasil dari `public/index.json`.

## Rencana Iterasi Berikutnya

- Otomatiskan regenerasi indeks pencarian (`npm run generate:search`) setiap konten berubah.
- Dokumentasikan pola commit konten di `docs/content-guidelines.md` (opsional).

Playbook ini akan diupdate setiap kali ada tambahan tooling atau prosedur baru pada Tahap 1.
