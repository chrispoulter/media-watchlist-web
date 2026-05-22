import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const gitCommitSha = process.env.GIT_COMMIT_SHA || undefined;
const version = gitCommitSha?.slice(0, 7) ?? process.env.npm_package_version;

// https://vite.dev/config/
export default defineConfig({
    define: {
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
