import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 배포 시 리포지토리 이름으로 변경하세요
  // 예: https://username.github.io/repo-name/ → base: '/repo-name/'
  base: process.env.NODE_ENV === 'production' ? '/chatbot-1/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/pages': path.resolve(__dirname, './src/pages'),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          cloudscape: [
            '@cloudscape-design/components',
            '@cloudscape-design/global-styles',
          ],
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: ['buffer'],
  },
});
