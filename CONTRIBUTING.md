# Kontribusi Web Novel Platform

Dokumen ini merangkum aturan kerja sejak fase awal agar pertumbuhan proyek tetap terarah. Ikuti panduan berikut sebelum mengirim perubahan.

## Prasyarat

- Node.js >= 22 (gunakan rilis LTS terbaru).
- Paket manajer tunggal: `pnpm` (direkomendasikan) atau `npm`. Dokumentasikan perbedaan jika memakai alat lain.
- Editor dengan dukungan ESLint, Prettier, dan formatter Markdown (mis. VS Code).

## Struktur Repo

- `content/novels/<slug>/<chapter>.md` - Bab novel dalam Vue Markdown dengan frontmatter wajib.
- `novels.json` - Registri metadata novel (judul, author, cover, status, tags, dsb.).
- `.vitepress/theme` - Komponen reader, store, dan konfigurasi tema khusus.
- `docs/` - Dokumentasi internal (stage playbook, audit, SOP).
- `scripts/` - Skrip validasi konten dan utilitas build (ditambah sesuai kebutuhan).

## Aturan Konten

- **Penamaan**: slug huruf kecil dengan tanda hubung, contoh `shadow-chronicle`. Bab mengikuti format `chapter-001.md`, `chapter-002.md`, dst.
- **Frontmatter wajib**:
  ```yaml
  ---
  id: ch-001
  novel: shadow-chronicle
  chapter: 1
  title: 'Awakening'
  prev: ./chapter-000.md
  next: ./chapter-002.md
  summary: 'Protagonis bangun di dunia lain.'
  keywords:
    - isekai
    - adventure
  releaseDate: 2024-01-05
  ---
  ```
- Pastikan tautan `prev`/`next` valid dan tidak ada bab ganda. Jalankan skrip validasi ketika tersedia.
- Hindari media besar langsung di Markdown; simpan di `public/assets/<slug>/` bila diperlukan.

## Standar Kode

- Gunakan TypeScript dengan mode `strict`. Hindari `any` kecuali diberi komentar TODO.
- Komponen Vue berada di `.vitepress/theme/components`. Bila panjangnya mendekati 200 baris, ekstraksi logic ke composable di `.vitepress/theme/composables`.
- Styling konsisten memakai CSS variables + utility (mis. Tailwind/UnoCSS) atau SCSS module. Hindari inline style kecuali darurat.
- Akses API (Tahap 2+) melalui layer `services/*.ts` dengan respons bertipe jelas dan penanganan error terpusat.
- Gunakan `localStorage` hanya melalui helper yang menangani serialisasi JSON dan fallback aman.

## Lint & Quality Gate

- Jalankan ESLint dan Prettier via `pnpm lint` dan `pnpm format`. Aturan lint harus lulus sebelum merge.
- Markdown lint (`pnpm lint:content`) memastikan frontmatter dan gaya penulisan konsisten.
- Eksekusi `pnpm typecheck` sebelum push.
- Catat audit Lighthouse manual di `docs/audit.md` setiap rilis Tahap 1.

## Alur Git

- Penamaan cabang: `feature/<deskripsi>`, `content/<novel-slug>`, atau `chore/<tugas>`.
- Format commit: `type(scope): pesan`. Contoh `feat(reader): add immersive mode toggle`.
- Sertakan deskripsi PR ringkas dan highlight area yang perlu perhatian reviewer.
- Checklist self-review:
  - [ ] Lint & typecheck lolos.
  - [ ] Struktur file mengikuti panduan.
  - [ ] Frontmatter & link bab valid (untuk perubahan konten).
  - [ ] Tidak ada aset besar atau data sensitif.
  - [ ] Dokumentasi diperbarui bila aturan berubah.

## Diskusi & Keputusan

- Catat keputusan arsitektural baru di `docs/decisions/` (ADR singkat).
- Perubahan aturan harus memperbarui `CONTRIBUTING.md` atau dokumen referensi terkait.

Terima kasih sudah membantu menjaga kualitas proyek. Jika menemukan aturan yang belum tercakup, buat issue atau PR untuk menambahkannya.
