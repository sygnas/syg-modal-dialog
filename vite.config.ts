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
    // root を demo にしているので、出力先はルートの dist を明示する（指定しないと demo/dist に出てしまう）。
    // dist には tsc と CSS・Vue 版のビルドも出すので、消さない
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
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
      // root を demo にしているので、型定義も基準をリポジトリのルートに戻す
      // （指定しないと src/js が見つからず、demo/dist に空の index.d.ts が出る）
      root: __dirname,
      include: ['src/js/**/*.ts'],
      outDir: 'dist',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
