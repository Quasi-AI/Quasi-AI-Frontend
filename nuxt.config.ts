export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: []
    },
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
        }
      }
    }
  },
  srcDir: 'src/',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: ['nuxt-icon', '@nuxt/ui', '@nuxtjs/color-mode'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  colorMode: {
    preference: 'light'
  },
  runtimeConfig: {
    public: {
      GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
      FRONTEND_URL: process.env.FRONTEND_URL,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
    }
  },
  compatibilityDate: '2025-02-10',
  plugins: ['~/plugins/fontawesome.js'],
  ssr: false
})
