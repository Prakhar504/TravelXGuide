import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // ⚡ PERFORMANCE: Enable Fast Refresh
      fastRefresh: true,
      // ⚡ PERFORMANCE: Optimize babel transformations
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime', { regenerator: true }]
        ]
      }
    }),
    tailwindcss(),
    // ⚡ PERFORMANCE: Compress assets with gzip (aggressive)
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024, // Compress files larger than 1KB
      deleteOriginalAssets: false,
      compressionOptions: {
        level: 9, // Maximum compression
      },
    }),
    // ⚡ PERFORMANCE: Compress assets with brotli (aggressive)
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
      deleteOriginalAssets: false,
      compressionOptions: {
        params: {
          [11]: 11, // Maximum compression level
        },
      },
    }),
    // ⚡ PERFORMANCE: Optimize images
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
    cors: true,
  },
  build: {
    // ⚡ PERFORMANCE: Enable code splitting with better granularity
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/scheduler/')) {
            return 'react-core';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }
          // UI Libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/lucide-react') || 
              id.includes('node_modules/@radix-ui')) {
            return 'ui-components';
          }
          // Large dependencies
          if (id.includes('node_modules/sweetalert2')) {
            return 'sweetalert';
          }
          if (id.includes('node_modules/react-toastify')) {
            return 'toastify';
          }
          if (id.includes('node_modules/axios')) {
            return 'axios';
          }
          if (id.includes('node_modules/socket.io-client')) {
            return 'socket';
          }
          // Other vendor modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        // ⚡ Optimize asset file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // ⚡ PERFORMANCE: Optimize chunk size
    chunkSizeWarningLimit: 500, // Stricter limit
    // ⚡ PERFORMANCE: Minify the code aggressively
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        passes: 2, // Run minification twice for better results
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    // ⚡ PERFORMANCE: Disable source maps in production
    sourcemap: false,
    // ⚡ PERFORMANCE: Set target for modern browsers only
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // ⚡ PERFORMANCE: CSS code splitting
    cssCodeSplit: true,
    // ⚡ PERFORMANCE: Enable module preload polyfill
    modulePreload: {
      polyfill: false, // Disable for modern browsers
    },
    // ⚡ PERFORMANCE: Enable asset inlining
    assetsInlineLimit: 4096, // Inline assets < 4KB
    // ⚡ PERFORMANCE: Report compressed size
    reportCompressedSize: true,
  },
  // ⚡ PERFORMANCE: Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'axios', 
      'framer-motion',
      'lucide-react',
      'react-toastify',
      'sweetalert2',
      'lodash',
    ],
    exclude: ['@vite/client', '@vite/env'],
    // Force optimization even in development
    force: false,
  },
  // ⚡ PERFORMANCE: Enable esbuild optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    legalComments: 'none',
    treeShaking: true,
  },
  define: {
    'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
    '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  // ⚡ PERFORMANCE: Enable CSS minification
  css: {
    postcss: './postcss.config.js',
    devSourcemap: false,
  },
})
