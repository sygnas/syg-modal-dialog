import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

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
  plugins: [vue()],
});
