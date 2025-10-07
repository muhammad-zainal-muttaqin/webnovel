# Stage 1 Playbook - Static Reader MVP (VitePress)

Dokumen ini menjadi referensi kerja Tahap 1: menyiapkan pengalaman membaca statis dengan konten Markdown dan deploy ke platform SSG.

## Sasaran Tahap 1

- Rilis halaman baca yang nyaman dengan kontrol tampilan lengkap (light/dark, font, ukuran, spacing, lebar).
- Pastikan seluruh chapter bisa diakses melalui struktur Markdown plus navigasi prev/next tanpa error.
- Bangun komponen dan struktur proyek yang siap direuse saat memasuki Tahap 2 (sinkronisasi API).

## Struktur Konten

- Folder utama: `content/novels/<slug>/chapter-XXX.md`.
- Metadata global novel: `novels.json` di root (judul, author, cover, status, tags, deskripsi singkat).
- Tambahkan skrip validasi (nantinya di `scripts/validate-content.ts`) untuk mengecek:
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
| `TableOfContents.vue` | Daftar isi novel                                        | Diisi dari `novels.json` dan metadata chapter         |
| `SearchDialog.vue`    | Pencarian cepat                                         | Mengonsumsi indeks statis (`public/index.json`)       |
| `SkeletonBlock.vue`   | Loading state generik                                   | Digunakan saat data belum tersedia                    |
| `ReaderNote.vue`      | Komponen untuk highlight atau blockquote khusus         | Dipanggil dalam Markdown                              |

### Composable dan Store

- `useReaderPreferences` - membaca dan menyimpan preferensi ke `localStorage` dengan fallback default.
- `useChapterProgress` - menghitung posisi progress berdasarkan panjang konten (opsional Tahap 1).
- `store/index.ts` - reactive store ringan untuk menyimpan preferensi dan status UI global.

### Konfigurasi VitePress

- `vitepress.config.ts`
  - `srcDir: "content"`.
  - `rewrites` untuk memetakan `novels/<slug>/<chapter>` ke URL `/novel/<slug>/<chapter>`.
  - `themeConfig` kustom untuk menonaktifkan sidebar default dan menghubungkan komponen reader.
- Plugin atau hook build:
  - Generator indeks pencarian - tulis file `public/index.json`.
  - Validator frontmatter (menggunakan skrip Node).

## Build dan Deploy

- Tambahkan workflow GitHub Actions (`.github/workflows/deploy.yml`):
  1. Checkout dan install dependency (`pnpm install --frozen-lockfile`).
  2. Jalankan `pnpm lint`, `pnpm typecheck`, `pnpm test` (opsional), `pnpm build`.
  3. Upload artefak dan deploy ke Cloudflare Pages, Vercel, atau GitHub Pages.
- Konfigurasikan environment untuk memicu workflow pada push ke `main` atau saat ada PR untuk review.

## Quality Gate Manual

- Lint dan typecheck harus lolos sebelum merge.
- Lakukan audit Lighthouse manual (desktop dan mobile) lalu catat skor di `docs/audit.md`.
- Baca sampel chapter di versi deployed untuk verifikasi:
  - Navigasi prev/next berfungsi.
  - Setting light/dark tersimpan dan diterapkan ulang saat reload.
  - Pencarian menampilkan hasil yang benar.

## Rencana Iterasi Berikutnya

- Siapkan kerangka `scripts/validate-content.ts`.
- Buat template generator untuk chapter baru (`pnpm run scaffold:chapter`).
- Dokumentasikan pola commit konten di `docs/content-guidelines.md` (opsional).

Playbook ini akan diupdate setiap kali ada tambahan tooling atau prosedur baru pada Tahap 1.
