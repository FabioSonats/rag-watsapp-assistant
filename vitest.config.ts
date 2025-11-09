import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['api/**/*.test.ts', 'packages/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './packages/shared/src'),
      '@rag-whatsapp-assistant/shared': path.resolve(__dirname, './packages/shared/src'),
      '@api': path.resolve(__dirname, './api'),
    },
  },
});

