import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import copyAndTranspileSass from './plugins/copy-and-transpile-sass';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'vue-snotify',
      formats: ['es', 'cjs'],
      fileName: (format) => `vue-snotify.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      }
    },
  },
  plugins: [
    vue(),
    copyAndTranspileSass({
      entry: path.resolve(__dirname, 'src'),
      include: [/styles\/\w+\.scss$/]
    })
  ],
  server: {
    port: 8080,
    fs: {
      strict: false,
    },
  },
});
