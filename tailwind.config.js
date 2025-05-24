/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5D3BEA',
        primaryHover: '#4A2DCA',
        darkBg: {
          primary: '#0C1438',
          secondary: '#111C44',
          tertiary: '#1A2B5F',
          accent: '#1E2A5A'
        }
      }
    }
  },
  plugins: []
}
