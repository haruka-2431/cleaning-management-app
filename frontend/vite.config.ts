import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [react(),tailwindcss(),
     checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json',
      },
    }),
  ],
  server: {
    proxy: {
      '/cleaning-edit': 'http://localhost:3000',
      '/api': 'http://localhost:3000'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    typecheck: {
      exclude: ['**/node_modules/**', '**/dist/**', '**/__tests__/**'],
    },
  },
});
