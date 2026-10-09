import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { mockApiPlugin } from './mocks/apiMock.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 백엔드 없이 UI 작업할 때만 dev 서버에 mock API를 붙인다(VITE_API_MOCK=true).
  const useMock = loadEnv(mode, process.cwd()).VITE_API_MOCK === 'true';

  return {
    plugins: [react(), tailwindcss(), svgr(), useMock && mockApiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
