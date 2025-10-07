# VitePress Reference Documentation

## Custom Layouts

VitePress supports custom layouts through frontmatter:

```yaml
---
layout: custom-layout-name
---
```

Layout files should be placed in `.vitepress/theme/layouts/`

## Default Theme Components

VitePress provides these built-in layouts:
- `doc` - Standard documentation layout with sidebar
- `home` - Homepage with hero section
- `page` - Simple page without sidebar

## Frontmatter Options

Common frontmatter fields:
- `title` - Page title
- `description` - Page description
- `layout` - Layout to use
- `navbar` - Show/hide navbar
- `sidebar` - Show/hide sidebar
- `aside` - Show/hide aside/TOC
- `outline` - Configure outline depth

## i18n Configuration

```ts
export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [...],
        sidebar: {...}
      }
    },
    id: {
      label: 'Indonesia', 
      lang: 'id',
      link: '/id/',
      themeConfig: {
        nav: [...],
        sidebar: {...}
      }
    }
  }
})
```

## Custom Theme

Extend default theme in `.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Custom enhancements
}
```

## Best Practices

1. Use built-in layouts when possible
2. Extend default theme, don't replace it
3. Keep custom CSS minimal
4. Use VitePress conventions for file structure
5. Follow VitePress naming patterns

## Common Patterns

### Navigation Between Pages

Use relative links:
```md
[Next Chapter](./chapter-002)
[Previous Chapter](./chapter-001)
```

### Custom Components

Register in theme enhanceApp:
```ts
enhanceApp({ app }) {
  app.component('MyComponent', MyComponent)
}
```

Use in markdown:
```md
<MyComponent />
```

