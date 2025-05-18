import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { imagetools } from 'vite-imagetools'

// Load environment variables
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: () => {
        return new URLSearchParams({
          format: 'webp;jpg',
          quality: '80'
        })
      },
      profiles: {
        standard: () => {
          return {
            resize: {
              width: 1280,
              withoutEnlargement: true
            },
            format: 'webp;jpg',
            quality: 75
          }
        },
        thumbnail: () => {
          return {
            resize: {
              width: 500,
              withoutEnlargement: true
            },
            format: 'webp;jpg',
            quality: 80
          }
        },
        icon: () => {
          return {
            resize: {
              width: 96,
              withoutEnlargement: true
            },
            format: 'webp;png',
            quality: 90
          }
        },
        banner: () => {
          return {
            resize: {
              width: 1920,
              withoutEnlargement: true
            },
            format: 'webp;jpg',
            quality: 70
          }
        }
      }
    })
  ],
  define: {
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'maps-vendor': ['@react-google-maps/api']
        }
      }
    }
  }
})
