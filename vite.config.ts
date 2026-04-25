import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['chatcv_fevi.webp'],
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5 MB
        },
        manifest: {
          name: 'ChatCV - Free AI Resume Builder',
          short_name: 'ChatCV',
          description: 'Create professional ATS-friendly resumes in minutes with AI.',
          theme_color: '#7C3AED',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/chatcv_fevi.webp',
              sizes: '512x512',
              type: 'image/webp',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'global': 'window',
      'process': { env: {} },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
