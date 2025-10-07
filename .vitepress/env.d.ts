/// <reference types="vitepress/client" />

declare module 'vitepress' {
  export * from 'vitepress/dist/node/index.js';
  export * from 'vitepress/dist/client/index.js';
  export { default } from 'vitepress/dist/node/index.js';
}

declare module 'vitepress/theme' {
  export { default } from 'vitepress/dist/client/theme-default/index.js';
  export * from 'vitepress/dist/client/theme-default/index.js';
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '*.json' {
  const value: unknown;
  export default value;
}
