import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import Sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://www.atideto.in',
      dynamicRoutes: [
        '/services',
        '/academy',
        '/about',
        '/client-connect',
        '/requirement-gathering',
        '/locations',
        '/privacy-policy',
        '/terms-and-conditions',
        ...[
          "salem", "chennai", "coimbatore", "erode", "namakkal", "dharmapuri", 
          "krishnagiri", "madurai", "trichy", "tiruppur", "karur", "vellore", 
          "hosur", "tirunelveli", "kanyakumari", "thoothukudi", "villupuram", 
          "cuddalore", "kanchipuram", "thanjavur", "dindigul", "ramanathapuram", 
          "nagapattinam", "pudukkottai", "virudhunagar", "sivagangai", 
          "perambalur", "ariyalur", "nilgiris"
        ].map(city => `/locations/${city}`)
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion', 'gsap'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
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
