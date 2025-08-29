import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh and optimizations
      fastRefresh: true,
    }),
    tailwindcss()
  ],
  build: {
    // Enable code splitting and chunk optimization
    rollupOptions: {
      output: {
        // Create separate chunks for better caching
        manualChunks: {
          // Vendor chunk for stable dependencies
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Redux chunk
          redux: ['@reduxjs/toolkit', 'react-redux'],
          // UI chunk
          ui: ['lucide-react', 'flowbite-react'],
          // HTTP client chunk
          http: ['axios']
        },
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (disable in production if needed)
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'lucide-react'
    ]
  },
  // Enable server-side optimizations
  server: {
    // Enable HTTP/2
    http2: true,
    // Enable compression
    compress: true
  },
  // Performance optimizations
  esbuild: {
    // Drop console and debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
})
