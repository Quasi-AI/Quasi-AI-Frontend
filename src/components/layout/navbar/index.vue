<template>
  <div class="my-6 flex items-center justify-between gap-2 px-2 py-3 pl-6">
    <h1 class="trucnate hidden text-sm font-medium md:block md:text-xl">
      {{ pageTitle }}
    </h1>
    <div
      class="m-2 ml-auto flex items-center justify-end gap-4 rounded-full p-4 py-1 shadow-md"
      :class="
        colorMode.value === 'dark' ? 'bg-[#111C44] text-white' : 'bg-white'
      "
    >
      <div class="my-2 flex flex-col items-center justify-center gap-4">
        <UInput
          v-model="q"
          name="q"
          placeholder="Search..."
          icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off"
          :ui="{ icon: { trailing: { pointer: '' } } }"
          variant="none"
          class="rounded-2xl lg:w-40"
          :class="colorMode.value === 'dark' ? 'bg-[#111C44]' : 'bg-[#F1F3FE]'"
        >
          <template #trailing>
            <UButton
              v-show="q !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="q = ''"
            />
          </template>
        </UInput>
      </div>

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

        <p class="flex items-center gap-1">
          <UDropdown
            mode="click"
            :popper="{ placement: 'right-start' }"
            :items="profileList"
            ><LayoutProfileImage
              :img-src="userInfo?.profileImage"
              :name="userInfo?.name"
              :scale="true"
              baseClass="w-[30px] h-[30px]"
          /></UDropdown>
        </p>
      </div>
    </div>
  </div>

  <h1 class="mx-6 flex text-sm font-extralight md:hidden md:text-xl">
    {{ pageTitle }}
  </h1>
</template>

<script setup lang="ts">
import lightModeIcon from '@/assets/icons/light-mode.vue'
import DarkModeIcon from '@/assets/icons/dark-mode.vue'
import { useAuthenticationStore } from '@/store/auth'

const { userInfo } = useUser()
const authStore = useAuthenticationStore()

const q = ref('')
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () =>
    (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark')
})

// Route-based dynamic title
const route = useRoute()
const pageTitle = computed(() => {
  const routeTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/dashboard/questions': 'Questions',
    '/dashboard/flashcards': 'Flashcards',
    '/dashboard/quizzes': 'Quizzes',
    '/dashboard/ai-tutor': 'AI Tutors',
    '/dashboard/find-tutors': 'Find Tutors',
    '/dashboard/essay': 'Essay',
    '/dashboard/speech-to-text': 'Speech to Text',
    '/dashboard/plagiarism': 'Plagiarism',
    '/plan': 'Plan',
    '/learning-games': 'Learning Games',
    '/smart-tutoring': 'Smart Tutoring',
    '/past-questions': 'Past Questions',
    '/doctor-ai': 'Doctor AI',
    '/user': 'User Profile'
  }
  return routeTitles[route.path] || 'Dashboard'
})

const profileList = [
  [
    { label: 'Go to profile', click: () => navigateTo('/user') },
    { label: 'Logout', click: () => authStore.logout() }
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
      href: 'https://raw.githubusercontent.com/Quasi-AI/Quasi-AI-Frontend/refs/heads/develop/src/assets/quasiailogo.png'
    },
    {
      href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap',
      rel: 'stylesheet'
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
    'https://raw.githubusercontent.com/Quasi-AI/Quasi-AI-Frontend/refs/heads/develop/src/assets/quasiailogo.png',
  twitterImage:
    'https://raw.githubusercontent.com/Quasi-AI/Quasi-AI-Frontend/refs/heads/develop/src/assets/quasiailogo.png',
  twitterCard: 'summary_large_image'
})
</script>
