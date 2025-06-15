import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        host: true,
        open: true,
        hmr: true,
        watch: {
            usePolling: true
        },
        fs: {
            strict: true
        }
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    },
    publicDir: 'public',
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
    optimizeDeps: {
        force: true,
        include: ['**/*.ts', '**/*.js']
    },
    plugins: [
        {
            name: 'force-reload',
            handleHotUpdate({ file, server }) {
                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                });
                return [];
            }
        }
    ],
    clearScreen: false,
    logLevel: 'info',
    base: './'
}); 