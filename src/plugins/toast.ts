import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Toast, {
    position: 'top-center',
    timeout: 3000
  })
})

export { useToast }
