import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { splitVendorChunkPlugin } from 'vite'

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
    }),
    splitVendorChunkPlugin()
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'google-maps': ['@googlemaps/js-api-loader'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils': ['date-fns', 'lodash'],
          'maps-vendor': ['@react-google-maps/api'],
          'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'ui-vendor': ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons'],
        },
        assetFileNames: (assetInfo) => {
          const imgType = /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i;
          const fontType = /\.(woff|woff2|eot|ttf|otf)$/i;
          
          if (imgType.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          
          if (fontType.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  define: {
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY)
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },
  optimizeDeps: {
    include: ['@googlemaps/js-api-loader']
  }
})
