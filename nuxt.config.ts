export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: false, // Disable automatic crawling
      routes: [] // Remove predefined routes
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

  compatibilityDate: '2025-02-10'
})
