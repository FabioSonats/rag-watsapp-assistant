import js from '@eslint/js';
import path from 'node:path';
import eslintPluginImport from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['frontend/dist', 'node_modules', 'packages/**/dist', '.vercel'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
        ...config,
        languageOptions: {
            ...config.languageOptions,
            parserOptions: {
                ...config.languageOptions?.parserOptions,
                project: path.join(import.meta.dirname, 'tsconfig.json'),
                tsconfigRootDir: import.meta.dirname,
            },
        },
    })),
    {
        name: 'project/custom-rules',
        plugins: {
            import: eslintPluginImport,
        },
        languageOptions: {
            sourceType: 'module',
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: path.join(import.meta.dirname, 'tsconfig.json'),
                },
            },
        },
        rules: {
            'import/order': [
                'error',
                {
                    groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                },
            ],
            'import/no-cycle': 'error',
            'import/no-unresolved': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
        },
    },
    prettier,
);

