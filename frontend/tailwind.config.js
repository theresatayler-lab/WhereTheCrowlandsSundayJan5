/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1C1C1C',
        foreground: '#D8CBB3',
        card: {
          DEFAULT: '#2a2a2a',
          foreground: '#D8CBB3',
        },
        popover: {
          DEFAULT: '#2a2a2a',
          foreground: '#D8CBB3',
        },
        primary: {
          DEFAULT: '#750609',
          foreground: '#D8CBB3',
        },
        secondary: {
          DEFAULT: '#06133c',
          foreground: '#D8CBB3',
        },
        muted: {
          DEFAULT: '#3a3a3a',
          foreground: '#A8A8A8',
        },
        accent: {
          DEFAULT: '#4B5A3E',
          foreground: '#D8CBB3',
        },
        destructive: {
          DEFAULT: '#750609',
          foreground: '#D8CBB3',
        },
        border: '#4a4a4a',
        input: '#2a2a2a',
        ring: '#750609',
        'raven-black': '#1C1C1C',
        'ash-gray': '#A8A8A8',
        'weathered-beige': '#D8CBB3',
        'forest-moss': '#4B5A3E',
        'rusted-copper': '#A35C3A',
        'blood-red': '#750609',
        'midnight-blue': '#06133c',
      },
      fontFamily: {
        'italiana': ['Italiana', 'serif'],
        'cinzel': ['Cinzel Decorative', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.25rem',
        sm: '0.125rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};