import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../packages/shared/src'),
      '@rag-whatsapp-assistant/shared': path.resolve(__dirname, '../packages/shared/src'),
    },
  },
});
