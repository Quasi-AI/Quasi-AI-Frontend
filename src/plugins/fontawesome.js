import { defineNuxtPlugin } from '#app';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFile, faFolder, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add the icons to the library
library.add(faMicrophone);
library.add(faFile);


export default defineNuxtPlugin((nuxtApp) => {
  // Register FontAwesomeIcon globally
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
