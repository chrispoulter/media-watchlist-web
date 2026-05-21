import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const gitCommitSha = process.env.VITE_GIT_COMMIT_SHA;
const version = gitCommitSha?.slice(0, 7) ?? process.env.npm_package_version;
const environment = process.env.NODE_ENV ?? 'development';

// https://vite.dev/config/
export default defineConfig({
    define: {
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
        'import.meta.env.VITE_APP_ENVIRONMENT': JSON.stringify(environment),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
