import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Плагин локального персистентного хранения сессий и сообщений в JSON-файл
function routesSessionStoragePlugin() {
  const sessionsFilePath = path.resolve(__dirname, 'routes_sessions_data.json');

  return {
    name: 'routes-session-storage-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/routes/sessions', (req: any, res: any, next: any) => {
        if (req.method === 'GET') {
          if (fs.existsSync(sessionsFilePath)) {
            const content = fs.readFileSync(sessionsFilePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(content);
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(null));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              fs.writeFileSync(sessionsFilePath, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), routesSessionStoragePlugin()],
  server: {
    port: 3005,
    proxy: {
      // Переадресация запросов к шлюзу V0.Programs.Gateways.Services0.Routes (порт 8042)
      '/API/V0': {
        target: 'http://localhost:8042',
        changeOrigin: true
      }
    }
  }
});
