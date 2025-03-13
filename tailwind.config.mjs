import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          dark: '#0a0f29',
          mid: '#1e2a5e',
          deep: '#131b3f',
        },
        nebula: {
          blue: '#6C63FF',
          purple: '#a194f9',
          pink: '#ff61d8',
        },
        'cosmic-celestial': {
          blue: '#3a86ff',
        },
        'cosmic-mars': {
          red: '#d62246',
        },
        'cosmic-nebula': {
          purple: '#5b2a86',
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'scale-up': 'scale-up 0.3s ease-out forwards',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': {
            opacity: '0.1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.15',
            transform: 'scale(1.05)',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-up': {
          from: {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          to: {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [animate],
}

export default config
