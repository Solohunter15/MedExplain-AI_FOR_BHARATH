/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'medical-green': {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5bb85b',
          500: '#2d7d32',
          600: '#256725',
          700: '#1f5220',
          800: '#1c421c',
          900: '#193719',
        },
        'privacy-black': {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1a1a1a',
        }
      },
      fontSize: {
        'elder-sm': ['16px', '1.6'],
        'elder-base': ['18px', '1.6'],
        'elder-lg': ['22px', '1.6'],
        'elder-xl': ['28px', '1.6'],
        'elder-2xl': ['32px', '1.6'],
      },
      spacing: {
        'elder': '1.5rem',
        'elder-lg': '2rem',
        'elder-xl': '3rem',
      },
      minHeight: {
        'touch': '44px',
        'elder-touch': '60px',
      },
      minWidth: {
        'touch': '44px',
        'elder-touch': '60px',
      }
    },
  },
  plugins: [],
}