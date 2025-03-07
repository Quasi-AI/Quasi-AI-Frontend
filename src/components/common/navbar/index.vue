<template>
  <div
    class="flex w-full items-center justify-between bg-white p-2 lg:justify-end lg:p-5 dark:bg-[#111C44] dark:text-white"
  >
    <NuxtLink to="/" class="flex w-40 items-center gap-2 truncate lg:hidden">
      <img
        src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
        alt="logo"
        class="w-8"
      />
      <span>QUASI AI</span>
    </NuxtLink>

    <div class="flex items-center gap-4">
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

      <p class="flex items-center gap-1">
        <UDropdown
          mode="click"
          :popper="{ placement: 'right-start' }"
          :items="profileList"
        >
          <CommonProfileImage
            :img-src="userInfo?.profileImage"
            :name="userInfo?.name"
            :scale="true"
            baseClass="w-[30px] h-[30px]"
            :class="[isUserRoute ? 'rounded-full ring-2 ring-blue-500' : '']"
          />
        </UDropdown>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import lightModeIcon from '@/assets/icons/light-mode.vue'
import DarkModeIcon from '@/assets/icons/dark-mode.vue'
import { useAuthenticationStore } from '@/store/auth'
import { useUser } from '~/composables/useUser'

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
    { label: 'Go to profile', click: () => navigateTo('/user') },
    {
      label: 'Logout',
      click: () => {
        authStore.logout()
        colorMode.preference = 'light'
      }
    }
  ]
]

const color = computed(() => (colorMode.value === 'dark' ? '#0C1438' : 'white'))

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
