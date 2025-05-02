import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import viteImagemin from 'vite-plugin-imagemin'

// Load environment variables
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 60,
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4,
      }
    })
  ],
  define: {
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
    'import.meta.env.BUILD_TIMESTAMP': JSON.stringify(new Date().toISOString())
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'maps-vendor': ['@react-google-maps/api']
        },
        // Force unique filenames for all assets
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    // Clean the output directory before building
    emptyOutDir: true,
    // Add timestamp to the build
    manifest: true,
    // Generate source maps
    sourcemap: true
  }
})
