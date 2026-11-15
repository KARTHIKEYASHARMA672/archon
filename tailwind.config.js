/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#A84E3A',
          hover: '#833A2B',
          light: '#C46B56',
          pale: '#FBECE8',
          deep: '#692C1F',
        },
        linen: {
          DEFAULT: '#F8F4EE',
          dark: '#EFE7DB',
          deep: '#E5DACB',
        },
        alabaster: {
          DEFAULT: '#FFFDF9',
          muted: '#F4EEE5',
        },
        graphite: {
          DEFAULT: '#2B201C',
          deep: '#1A1412',
          muted: '#6C5D54',
          subtle: '#8C7A70',
        },
        brass: {
          DEFAULT: '#C89B72',
          light: '#E5C4A3',
          dark: '#A67950',
          burnished: '#8B613A',
        },
        blueprint: {
          DEFAULT: '#243B53',
          dark: '#142334',
          grid: '#334E68',
          accent: '#486581',
          light: '#E0F0FE',
        },
        pine: {
          DEFAULT: '#2D5A46',
          light: '#437C63',
          pale: '#EDF5F1',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        editorial: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'tactile': '0 2px 8px -2px rgba(43, 32, 28, 0.06), 0 1px 3px 0 rgba(43, 32, 28, 0.04)',
        'tactile-md': '0 6px 16px -4px rgba(43, 32, 28, 0.08), 0 2px 6px -1px rgba(43, 32, 28, 0.05)',
        'tactile-lg': '0 12px 32px -6px rgba(43, 32, 28, 0.12), 0 4px 12px -2px rgba(43, 32, 28, 0.06)',
        'blueprint': 'inset 0 0 40px rgba(16, 28, 44, 0.4)',
      }
    },
  },
  plugins: [],
}