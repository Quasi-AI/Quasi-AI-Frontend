<template>
  <div class="flex flex-col 2xl:h-screen">
    <div class="mb-[10%] flex-grow overflow-y-auto overflow-x-hidden p-2">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import Questions from '@/components/apps/questions/index.vue'
import FlashCards from '@/components/apps/flashcards/index.vue'
import Quizzes from '@/components/apps/quizzes/index.vue'
import AiTutor from '@/components/apps/ai-tutor/index.vue'
import DoctorAi from '@/components/apps/doctor-ai/index.vue'
import SmartTuroting from '@/components/apps/smart-tutoring/index.vue'
import FindTutors from '@/components/apps/find-tutors/index.vue'
import Essay from '@/components/apps/essay/index.vue'
import SpeechToText from '@/components/apps/speech-to-text/index.vue'
import Plagiarism from '@/components/apps/plagiarism/index.vue'
import Plan from '@/components/apps/plan/index.vue'
import LearningGames from '@/components/apps/learning-games/index.vue'
import Dashboard from '@/components/apps/lists.vue'
import Support  from '@/components/apps/support/index.vue'

const route = useRoute()

const componentsMap = {
  '/dashboard/questions': Questions,
  '/dashboard/flashcards': FlashCards,
  '/dashboard/quizzes': Quizzes,
  '/dashboard/ai-tutor': AiTutor,
  '/dashboard/find-tutors': FindTutors,
  '/dashboard/essay': Essay,
  '/dashboard/speech-to-text': SpeechToText,
  '/dashboard/plagiarism': Plagiarism,
  '/dashboard/support': Support,
  '/plan': Plan,
  '/learning-games': LearningGames,
  '/smart-tutoring': SmartTuroting,
  '/past-questions?type=past-questions': Questions,
  '/doctor-ai': DoctorAi,
  '/dashboard': Dashboard
}

const currentComponent = computed(() => {
  return componentsMap[route.path] || Dashboard
})
</script>
