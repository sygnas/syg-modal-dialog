import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // デモページのルートディレクトリを指定
  root: 'demo',
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/js/SygModalDialog.ts'),
      name: 'SygModalDialog',
      fileName: (format) => `syg-modal-dialog.${format}.js`,
      formats: ['es', 'umd'],
    },
    sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [
    vue(),
    dts({
      include: ['src/js/**/*.ts'],
      outDir: 'dist',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
