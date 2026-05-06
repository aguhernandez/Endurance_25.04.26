/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#514163',
          'purple-light': '#6b5578',
          'purple-lighter': '#8a7396',
          yellow: '#fdda36',
        },
        secondary: {
          'text-primary': '#1f2937',
          'text-secondary': '#4b5563',
          'text-tertiary': '#9ca3af',
          'bg-secondary': '#f9fafb',
          'bg-tertiary': '#f3f4f6',
          'border': '#e5e7eb',
        },
        accent: {
          blue: '#3b82f6',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#fdda36',
        },
      },
      fontFamily: {
        heading: ['Krona One', 'sans-serif'],
        body: ['Jost', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'var(--safe-area-inset-top, 0px)',
        'safe-bottom': 'var(--safe-area-inset-bottom, 0px)',
        'safe-left': 'var(--safe-area-inset-left, 0px)',
        'safe-right': 'var(--safe-area-inset-right, 0px)',
      },
      animation: {
        'slide-up': 'slide-up 0.4s ease-out',
        'slideUp': 'slideUp 0.15s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(100px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slideUp': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(100px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
