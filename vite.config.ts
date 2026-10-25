import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function backendServerPlugin() {
  return {
    name: 'backend-server-plugin',
    configureServer() {
      import('http').then(http => {
        const req = http.get('http://localhost:5000/api/health', () => {});
        req.on('error', () => {
          import('child_process').then(({ spawn }) => {
            console.log('[Vite] Launching Atideto MySQL backend server on port 5000...');
            const child = spawn('node', ['server/server.cjs'], {
              stdio: 'inherit',
              shell: true
            });
            child.unref();
          });
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),
    backendServerPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ]
        }
      }
    }
  }
});
