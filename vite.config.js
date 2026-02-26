/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxy = env.VITE_DEVELOPMENT_API_TARGET
    ? {
        '/api': {
          target: env.VITE_DEVELOPMENT_API_TARGET,
          secure: env.VITE_API_DISABLE_SSL === 'true' ? false : undefined,
        },
      }
    : undefined;

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        store: path.resolve(__dirname, './src/store'),
        components: path.resolve(__dirname, './src/components'),
        utils: path.resolve(__dirname, './src/utils'),
        pages: path.resolve(__dirname, './src/pages'),
        services: path.resolve(__dirname, './src/services'),
        integrations: path.resolve(__dirname, './src/integrations'),
        model: path.resolve(__dirname, './src/model'),
      },
    },
  };
});
