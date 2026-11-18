import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/vue/index.ts'),
      name: 'syg-modal-dialog-vue',
      formats: ['es'],
      fileName: () => 'vue/index.js',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: false,
  },
  plugins: [
    vue(),
    // package.json の exports（./vue の types）が指す dist/vue/index.d.ts を作る
    dts({
      root: __dirname,
      include: ['src/vue/**/*.ts', 'src/vue/**/*.vue'],
      exclude: ['src/vue/shims-vue.d.ts'],
      entryRoot: 'src/vue',
      outDir: 'dist/vue',
    }),
  ],
});
