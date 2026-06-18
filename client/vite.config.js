import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'profile.jpg'],
      manifest: {
        name: 'Truong A - Portfolio',
        short_name: 'Portfolio',
        description: 'Software Engineer Portfolio',
        theme_color: '#6366f1',
        background_color: '#020617',
        display: 'standalone',
        icons: [
          { src: 'favicon.png', sizes: '192x192', type: 'image/png' },
          { src: 'favicon.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  server: { port: 5173 }
});