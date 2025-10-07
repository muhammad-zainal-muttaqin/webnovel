# Implementation Changes - Reader Simplification

## Problem dengan Implementasi Sebelumnya

1. **Custom Layout Terlalu Kompleks**
   - Layout `reader` custom yang tidak standard VitePress
   - Banyak komponen custom yang duplikasi fitur VitePress built-in
   - Sulit maintain dan debug

2. **Tidak Mengikuti VitePress Best Practices**
   - VitePress sudah provide layout `doc` dengan fitur lengkap
   - Built-in prev/next navigation
   - Built-in sidebar dan outline
   - Responsive design default

3. **Font dan Styling Tidak Konsisten**
   - Japanese font stack untuk content berbahasa Jepang
   - Konflik dengan VitePress default theme

## Solusi - Standard VitePress Approach

### 1. Gunakan Layout `doc` Built-in

**Sebelum:**
```yaml
---
layout: reader
id: chapter-001
novel: unnamed-memory
prev: null
next: ./chapter-002.md
---
```

**Sesudah:**
```yaml
---
title: Chapter Title
layout: doc
prev:
  text: 'Previous Chapter'
  link: '/path/to/prev'
next:
  text: 'Next Chapter'
  link: '/path/to/next'
---
```

### 2. Manfaat Approach Baru

✅ **Lebih Simple**
- Pakai komponen VitePress yang sudah teruji
- Tidak perlu maintain custom components
- Kode lebih clean dan mudah dipahami

✅ **Fitur Built-in**
- Prev/Next navigation otomatis
- Sidebar otomatis (jika dikonfigurasi)
- Outline/TOC otomatis dari headings
- Dark mode support built-in
- Responsive design

✅ **Konsisten dengan VitePress**
- Styling konsisten
- Font system yang universal
- Update VitePress langsung dapat fitur baru

### 3. Konfigurasi untuk Reading Experience

Di `.vitepress/config.ts`:

```ts
export default defineConfig({
  themeConfig: {
    // Customize reading experience
    outline: [2, 3], // Show h2 and h3 in outline
    
    // Localized navigation
    docFooter: {
      prev: 'Previous Chapter',
      next: 'Next Chapter'
    }
  }
})
```

### 4. Custom Styling (Minimal)

Jika perlu custom styling, extend via `.vitepress/theme/custom.css`:

```css
/* Better reading experience */
.vp-doc {
  max-width: 720px;
  line-height: 1.8;
}

.vp-doc p {
  margin: 1.25rem 0;
}
```

## Migration Checklist

- [x] Update chapter-001.md to use `layout: doc`
- [x] Update chapter-002.md to use `layout: doc`  
- [x] Update chapter-003.md to use `layout: doc`
- [x] Remove custom reader layout (optional, untuk backward compatibility)
- [x] Update font stack ke system fonts
- [x] Simplify custom CSS
- [ ] Test all chapters
- [ ] Update documentation

## Next Steps

1. Test semua chapter dengan layout baru
2. Hapus/archive custom reader components jika tidak diperlukan
3. Update readme dengan approach baru
4. Dokumentasikan best practices untuk add chapter baru

