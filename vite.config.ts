import { defineConfig, UserConfig } from 'vite';
import { UserConfig as VitestUserConfig } from 'vitest';
import vue from '@vitejs/plugin-vue';

export default defineConfig(env => {
  const config: UserConfig | VitestUserConfig = {
    clearScreen: false,
    logLevel: 'info',
    plugins: [vue()],
  };

  if (env.mode === 'test') {
    config.test = {
      globals: true,
      environment: 'jsdom',
    };
  }

  return config;
});
