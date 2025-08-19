/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      primary: ["Poppins", "sans-serif"],
    },
    screens: {
      sm: "30em",
      md: "50em",
      lg: "70em",
    },
    extend: {
      colors: {
        gold: '#D4AF37',
        accent: '#D4AF37',
        'primary-gold': '#D4AF37',
        'primary-gold-light': '#F4D03F',
        'primary-gold-dark': '#B7950B',
        'cream': '#E8E1D5',
        'cream-light': '#F2EDE3',
        'cream-dark': '#DDD4C7',
        'warm-white': '#F5F2ED',
        'warm-gray': '#EBE5DD',
        'soft-gray': '#D6CFC5',
        'darker-cream': '#D4CAB8',
        'luxury-dark': '#121212',
        'luxury-card': '#1A1A1A',
        'luxury-border': '#2A2A2A',
        // Enhanced neutrals for better contrast
        'cream-50': '#FEFCF8',
        'cream-100': '#F8F6F0',
        'cream-200': '#F2EDE3',
        'cream-300': '#E8E1D5',
        'cream-400': '#DDD4C7',
        'cream-500': '#D4CAB8',
        'cream-600': '#C4B5A3',
        'cream-700': '#A89786',
        'cream-800': '#8B7A6A',
        'cream-900': '#6E5D4E',
        // Semantic state colors
        'success': '#10B981',
        'success-light': '#34D399',
        'success-dark': '#059669',
        'warning': '#F59E0B',
        'warning-light': '#FBBF24',
        'warning-dark': '#D97706',
        'error': '#EF4444',
        'error-light': '#F87171',
        'error-dark': '#DC2626',
        'info': '#3B82F6',
        'info-light': '#60A5FA',
        'info-dark': '#2563EB',
      },
      fontSize: {
        "5xl": "3rem",
        "7xl": "4rem",
        "8xl": "5rem",
      },
      boxShadow: {
        'luxury': '0 4px 30px rgba(212, 175, 55, 0.1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        fadeInUp: 'fadeInUp 0.6s ease-out',
        slideInFromRight: 'slideInFromRight 0.5s ease-out',
        slideInFromLeft: 'slideInFromLeft 0.5s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        shake: 'shake 0.5s ease-in-out',
        shimmer: 'shimmer 2s infinite',
        float: 'float 3s ease-in-out infinite',
        blob: 'blob 7s infinite',
        'blob-slow': 'blob 10s infinite'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
};
