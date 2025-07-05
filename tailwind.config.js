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
        'royal-blue': '#4169E1',
        'royal-blue-light': '#6495ED',
        'royal-blue-dark': '#191970',
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
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        shake: 'shake 0.3s ease-in-out'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
};
