<template>
  <div class="z-50 flex items-center justify-between px-4 py-2">
    <h1 class="text-2xl font-extralight">{{ pageTitle }}</h1>

    <div
      class="m-2 flex items-center justify-end gap-4 rounded-full p-4 py-1 shadow-sm"
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
          <NuxtLink to="/user" class="text-md">Kwame</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import lightModeIcon from '@/assets/icons/light-mode.vue'
import DarkModeIcon from '@/assets/icons/dark-mode.vue'

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
    '/smart-tutor?type=smart-tutoring': 'Smart Tutoring',
    '/past-questions?type=past-questions': 'Past Questions',
    '/doctor-ai?type=doctor-ai': 'Doctor AI',
    '/user': 'User Profile'
  }
  return routeTitles[route.path] || 'Dashboard'
})
</script>
