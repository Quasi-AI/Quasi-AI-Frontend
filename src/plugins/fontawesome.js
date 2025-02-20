import { defineNuxtPlugin } from '#app'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCalendarAlt,
  faFile,
  faFolder,
  faMicrophone,
  faPaperPlane,
  faPlane,
  faUpload,
  faVideo
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add the icons to the library
library.add(faMicrophone)
library.add(faFile)
library.add(faUpload)
library.add(faVideo)
library.add(faPaperPlane)
library.add(faCalendarAlt)

export default defineNuxtPlugin(nuxtApp => {
  // Register FontAwesomeIcon globally
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
