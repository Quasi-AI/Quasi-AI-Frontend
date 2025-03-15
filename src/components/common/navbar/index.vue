<template>
  <div
    class="fixed top-0 z-30 flex w-full items-center justify-between bg-white p-5 shadow-sm lg:justify-end dark:bg-[#111C44] dark:text-white"
  >
    <NuxtLink to="/" class="flex w-40 items-center gap-2 truncate lg:hidden">
      <img
        src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
        alt="logo"
        class="w-10"
      />
      <h1 class="text-2xl font-bold">QUASI AI</h1>
    </NuxtLink>

    <div class="flex items-center gap-2">
      <lightModeIcon
        v-if="!isDark"
        @click="isDark = !isDark"
        class="cursor-pointer"
      />
      <DarkModeIcon
        v-if="isDark"
        @click="isDark = !isDark"
        class="cursor-pointer"
      />

      <div class="flex items-center gap-2">
        <UDropdown
          mode="click"
          :popper="{ placement: 'right-start', arrow: true }"
          :items="profileList"
          class="w-fit dark:bg-[#111C44] dark:text-white"
        >
          <div class="flex items-center gap-2">
            <CommonProfileImage
              :img-src="userInfo?.profileImage"
              :name="userInfo?.name"
              :scale="true"
              baseClass="w-[30px] h-[30px]"
              :class="[isUserRoute ? 'rounded-full ring-2 ring-blue-500' : '']"
            />
            <ArrowDownLeftIcon class="h-5 w-5 cursor-pointer text-gray-500" />
          </div>
        </UDropdown>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import lightModeIcon from '@/assets/icons/light-mode.vue'
import DarkModeIcon from '@/assets/icons/dark-mode.vue'
import { useAuthenticationStore } from '@/store/auth'
import { useUser } from '~/composables/useUser'
import ArrowDownLeftIcon from '@/assets/icons/arrow-down.vue'

const { userInfo } = useUser()
const authStore = useAuthenticationStore()
const route = useRoute()

const isUserRoute = computed(() => route.path === '/user')

const q = ref('')
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () =>
    (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark')
})

const profileList = [
  [
    { label: 'Go to Profile', click: () => navigateTo('/user') },
    {
      label: 'Logout',
      click: () => {
        authStore.logout()
        colorMode.preference = 'light'
      }
    }
  ]
]

const color = computed(() => (colorMode.value === 'dark' ? '#111C44' : 'white'))

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: 'https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png'
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: 'Quasi AI',
  description:
    'Transform your learning experience with Quasi AI, the all-in-one learning platform that generates flashcards, quizzies, and study materials instantly from your lectures, notes, pdfs, and presentations.',
  ogImage:
    'https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png',
  twitterImage:
    'https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png',
  twitterCard: 'summary_large_image'
})
</script>
