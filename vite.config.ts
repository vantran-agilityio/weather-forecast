import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // basicSsl(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: ['**/*'],

      manifest: {
        name: 'Weather',
        short_name: 'Weather',
        description: 'This is the weather forecast app.',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],

        display: 'standalone',
        orientation: 'portrait',
        lang: 'en',
        scope: '/',
        start_url: '/',
        background_color: '#391A49',
        theme_color: '#391A49',
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,png,jpg,jpeg,svg,woff2,woff,eot,ttf,ico}',
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        // Custom runtime caching strategies
        runtimeCaching: [
          {
            // Cache weather API responses (adjust the pattern to match your actual API)
            urlPattern:
              /^(https:\/\/api\.open-meteo\.com\/v1\/forecast|http:\/\/api\.openweathermap\.org\/geo\/1\.0\/direct)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'weather-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 24 hours stale cache
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            // Cache static assets with a Cache First strategy
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 2592000, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            // Cache app shell files
            urlPattern: /\/(index\.html)?$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell-cache',
              expiration: {
                maxAgeSeconds: 86400, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            // Cache CSS/JS with a stale-while-revalidate strategy
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],

        importScripts: ['js/sw-notifications.js'],
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
      },
    }),
  ],

  resolve: {
    alias: {
      '@screens': path.resolve(__dirname, './src/screens'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@models': path.resolve(__dirname, './src/models'),
      '@services': path.resolve(__dirname, './src/services'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
