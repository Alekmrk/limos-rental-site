import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// Load environment variables
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      include: ['src/assets'],
      includePublic: true,
      logStats: true,
      ansiColors: true,
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false,
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
      png: {
        // Lossless optimization for PNG
        quality: 85,
        compressionLevel: 9,
      },
      jpeg: {
        // Lossy optimization for JPEG
        quality: 80,
        progressive: true,
      },
      jpg: {
        // Lossy optimization for JPG
        quality: 80,
        progressive: true,
      },
      webp: {
        // Lossy optimization for WebP
        lossless: false,
        quality: 85,
        effort: 6,
        smartSubsample: true,
      },
      avif: {
        // AVIF specific settings
        lossless: false,
        quality: 85,
        effort: 6,
      },
      gif: {
        // GIF specific settings
        optimizationLevel: 3,
      },
      cache: false, // Disable cache in development
      cacheLocation: '.vite-plugin-image-optimizer-cache',
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: false // Keep debugger statements
      }
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Add content hash to image files for cache busting
          if (assetInfo.name.match(/\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
  define: {
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY)
  }
})
