import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { handleChatRequest } from './api/chat';
import { handleContactRequest } from './api/contact';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/chat' || url === '/api/contact') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              (req as any).body = body ? JSON.parse(body) : {};
            } catch {
              (req as any).body = body;
            }

            (res as any).status = function (code: number) {
              res.statusCode = code;
              return res;
            };
            (res as any).json = function (obj: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(obj));
              return res;
            };

            try {
              if (url === '/api/chat') {
                await handleChatRequest(req, res);
              } else if (url === '/api/contact') {
                await handleContactRequest(req, res);
              }
            } catch (err: any) {
              console.error('API middleware error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Vite only exposes .env.local values to client-side import.meta.env by default.
  // The /api/chat and /api/contact handlers run as plain Node code (via the dev
  // middleware below, and as real serverless functions on Vercel) and read their
  // keys from process.env directly, so we load every var from .env / .env.local
  // here and copy it into process.env for this dev server's own process.
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
