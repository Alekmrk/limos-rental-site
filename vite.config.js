import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import viteImagemin from 'vite-plugin-imagemin'

dotenv.config()

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
        quality: 40,
        progressive: true
      },
      pngquant: {
        quality: [0.5, 0.7],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: true,
          },
        ],
      },
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
          vendor: ['react', 'react-dom', '@react-google-maps/api', 'react-router-dom']
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/img/[name].[hash][extname]`
          }
          return `assets/[name].[hash][extname]`
        }
      }
    },
    chunkSizeWarningLimit: 2000,
    assetsInlineLimit: 8192,
    emptyOutDir: true,
    manifest: true,
    sourcemap: false,
    target: 'esnext',
    minify: 'esbuild'
  }
})
