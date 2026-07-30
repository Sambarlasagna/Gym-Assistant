import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        outDir: '../workout-diet/dist',
        emptyOutDir: true,
        rollupOptions: {
            input: './index.html',
            output: {
                entryFileNames: 'assets/gymfit-react.js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'assets/gymfit-react.css';
                    }
                    return 'assets/[name][extname]';
                }
            }
        },
        sourcemap: true
    }
});
