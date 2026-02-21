/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#2e7d32',
          'primary-content': '#ffffff',
          'base-100': '#e8f5e9',
          'base-content': '#1b5e20',
          neutral: '#374151',
          'neutral-content': '#ffffff',
        },
      },
      {
        dark: {
          primary: '#43a047',
          'primary-content': '#ffffff',
          'base-100': '#1a2f17',
          'base-content': '#c8e6c9',
          neutral: '#1f2937',
          'neutral-content': '#c8e6c9',
        },
      },
    ],
  },
};
