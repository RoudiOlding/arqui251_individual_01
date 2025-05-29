import { defineConfig } from 'astro/config';

export default defineConfig({
    server: {
        proxy: {
        '/api': 'http://backend-service:3001'
        }
    }
});