import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/js/SygModalDialog.ts'),
      name: 'SygModalDialog',
      fileName: (format) => `syg-modal-dialog.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'style.css';
          }
          return assetInfo.name || '';
        },
      },
    },
    sourcemap: true,
    cssCodeSplit: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [
    dts({
      include: ['src/js/**/*.ts'],
      outDir: 'dist',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  server: {
    open: '/demo/index.html',
  },
});
