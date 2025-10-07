# Web Novel Platform - Implementation Notes

Platform ini dibangun bertahap agar cepat meluncurkan pengalaman membaca dasar, lalu berkembang ke fitur sinkronisasi dan akhirnya migrasi ke framework SSR penuh ketika diperlukan.

## Tahap Pengembangan

### Tahap 1 - Reader SSG + Konten Markdown

- **Lingkup**: landing page, katalog novel dasar, halaman baca dengan mode terang/gelap, pengaturan font dan spacing, immersive mode, TOC, skeleton loading.
- **Konten**: semua chapter disimpan sebagai file Vue Markdown (`.md`) di repo. Metadata global novel berada di `novels.json`.
- **Target**: pengalaman membaca nyaman tanpa ketergantungan server tambahan. Render HTML penuh sehingga SEO langsung efektif.
- **Komponen wajib** (disimpan di `.vitepress/theme/components`):
  - `ReaderShell.vue` - layout utama pembaca.
  - `ReaderSettings.vue` - panel pengaturan (font, size, spacing, dark mode) dengan penyimpanan `localStorage`.
  - `ChapterNav.vue` - navigasi bab berikut/sebelumnya plus progress bar.
  - `TableOfContents.vue` - daftar konten bab.
  - `ReaderNote.vue` - komponen opsional untuk catatan atau highlight.
  - `DarkModeToggle.vue`, `SearchDialog.vue`, `SkeletonBlock.vue` (loader generik).
- **Pencarian**: bangun indeks statis (mis. FlexSearch atau Minisearch) saat build dan sajikan sebagai `public/index.json` agar pencarian bekerja tanpa backend.
- **Deploy**: gunakan GitHub Actions untuk build VitePress dan rilis ke Cloudflare Pages, Vercel, atau GitHub Pages setiap ada perubahan konten maupun tema.

### Tahap 2 - Fitur Sinkronisasi via API

- **Penambahan**: login/register, guest mode, continue reading, bookshelf, reading stats sederhana, dashboard author basic.
- **Arsitektur**: tetap gunakan VitePress sebagai shell, tetapi komponen melakukan fetch ke API terpisah. State dikelola dengan store ringan (mis. Pinia) yang diintegrasikan manual.
- **Catatan**: mulai ekstraksi komponen UI ke paket terpisah (`packages/ui`) agar mudah dipindahkan ke framework SSR nantinya.

### Tahap 3 - Migrasi ke Framework SSR

- **Pemicu migrasi**: kebutuhan SEO yang menuntut HTML personal per user, meningkatnya kompleksitas routing dan proteksi halaman, monetisasi atau rekomendasi yang harus diproses server-side, build statis mulai lambat.
- **Langkah**: porting modul pembaca dan dashboard ke framework SSR (Nuxt atau Next). Landing dan marketing bisa tetap di VitePress sementara transisi berlangsung.

## Struktur Konten dan Metadata

```
content/
|-- novels/
|   |-- <slug>/
|   |   |-- chapter-001.md
|   |   |-- chapter-002.md
|   |   `-- ...
`-- novels.json
```

### Contoh Frontmatter Chapter

```yaml
---
id: ch-001
novel: shadow-chronicle
chapter: 1
title: 'Awakening'
releaseDate: 2024-01-05
summary: 'Protagonis bangun di dunia lain.'
prev: ./chapter-000.md
next: ./chapter-002.md
keywords:
  - isekai
  - adventure
---
```

Bagian isi dapat memakai komponen Vue (contoh: `<ReaderNote>`), sehingga gaya konsisten dengan tema pembaca.

## Konfigurasi VitePress

- Set `srcDir: "content"` pada `vitepress.config.ts`.
- Gunakan `rewrites` untuk memetakan folder `novels/<slug>/<chapter>` menjadi URL bersih (`/novel/<slug>/<chapter>`).
- Tambahkan hook build untuk menghasilkan `public/index.json` (indeks pencarian) dan memvalidasi frontmatter.
- Siapkan tema khusus di `.vitepress/theme/index.ts` yang mendaftarkan komponen reader dan meng-inject store (Pinia) ketika runtime.

## Pipeline dan Deployment

- **CI**: workflow GitHub Actions yang menjalankan lint, build VitePress, dan mengirim hasil ke platform hosting.
- **Hosting**: Cloudflare Pages, Vercel, atau GitHub Pages cocok untuk Tahap 1 karena hanya membutuhkan artefak statis.
- **Pemutakhiran konten**: setiap commit yang menambah atau mengubah markdown otomatis memicu rebuild.

## Langkah Berikutnya

1. Buat struktur folder `content/novels` dan `novels.json`.
2. Implementasikan tema kustom VitePress beserta komponen reader yang disebutkan.
3. Susun workflow CI/CD untuk build dan deploy otomatis.
4. Setelah Tahap 1 stabil, mulai desain API untuk Tahap 2 (auth, progress, bookshelf).

Dokumen ini akan diperbarui seiring bertambahnya kebutuhan dan saat kita memasuki Tahap 2.

## Dokumentasi Tambahan

- `CONTRIBUTING.md` - aturan kontribusi, standar kode, dan workflow review.
- `docs/stage-1.md` - playbook lengkap untuk eksekusi Tahap 1 (Static Reader MVP).

## Skrip Pengembangan

- `npm run lint` - menjalankan ESLint untuk `.ts`, `.js`, dan `.vue`.
- `npm run typecheck` - pemeriksaan TypeScript menggunakan `tsc --noEmit`.
- pm run validate:content - validasi struktur Markdown di content/novels.
- pm run lint:content - alias untuk menjalankan validator konten.
- pm run generate:search - menghasilkan indeks pencarian statis di public/index.json.
- pm run docs:dev - menjalankan VitePress development server setelah regenerasi indeks.
- pm run docs:build - membangun output statis VitePress (disertai regenerasi indeks).
- pm run format /
  pm run format:check - format otomatis atau cek format via Prettier.
- pm run check - lint, typecheck, dan validasi konten dijalankan berurutan.
