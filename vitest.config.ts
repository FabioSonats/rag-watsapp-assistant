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
      '@shared': './packages/shared/src',
      '@api': './api',
    },
  },
});

