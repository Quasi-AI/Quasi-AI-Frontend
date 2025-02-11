export default defineNuxtConfig({
  srcDir: 'src/',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: ['nuxt-icon', '@nuxt/ui', '@nuxtjs/color-mode', '@nuxt/content'],

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
