<template>
  <div class="flex flex-col 2xl:h-screen">
    <div class="mb-[10%] flex-grow overflow-y-auto overflow-x-hidden p-2">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

import Questions from '@/components/apps/questions/index.vue'
import FlashCards from '@/components/apps/flashcards/index.vue'
import Quizzes from '@/components/apps/quizzes/index.vue'
import AiTutor from '@/components/apps/ai-tutor/index.vue'
import FindTutors from '@/components/apps/find-tutors/index.vue'
import Essay from '@/components/apps/essay/index.vue'
import SpeechToText from '@/components/apps/speech-to-text/index.vue'
import Plagiarism from '@/components/apps/plagiarism/index.vue'
import Plan from '@/components/apps/plan/index.vue'
import LearningGames from '@/components/apps/learning-games/index.vue'
import Dashboard from '@/components/apps/lists.vue'

// Sample authentication check, adjust according to your store or cookie
const isAuthenticated = computed(() => {
  // Check your authentication method, for example, using Vuex or a cookie
  return localStorage.getItem('authToken') !== null // Example check
})

const route = useRoute()
const router = useRouter()

// Redirect to login if not authenticated
onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/auth/login') // Redirect to login page
  }
})

const componentsMap = {
  '/dashboard/questions': Questions,
  '/dashboard/flashcards': FlashCards,
  '/dashboard/quizzes': Quizzes,
  '/dashboard/ai-tutor': AiTutor,
  '/dashboard/find-tutors': FindTutors,
  '/dashboard/essay': Essay,
  '/dashboard/speech-to-text': SpeechToText,
  '/dashboard/plagiarism': Plagiarism,
  '/plan': Plan,
  '/learning-games': LearningGames,
  '/smart-tutoring?type=smart-tutoring': AiTutor,
  '/past-questions?type=past-questions': Questions,
  '/doctor-ai?type=doctor-ai': AiTutor,
  '/dashboard': Dashboard
}

const currentComponent = computed(() => {
  return componentsMap[route.path] || Dashboard
})
</script>
