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
import AiTutor from '@/components/apps/chats/ai-tutor/index.vue'
import FindTutors from '@/components/apps/find-tutors/index.vue'
import Essay from '@/components/apps/essay/index.vue'
import SpeechToText from '@/components/apps/speech-to-text/index.vue'
import Plan from '@/components/apps/other/plan/index.vue'
import LearningGames from '@/components/apps/games/index.vue'
import CustomerSupport from '@/components/apps/other/support/index.vue'
import Dashboard from '@/components/apps/lists.vue'

const route = useRoute()

const componentsMap = {
  '/apps': Dashboard,
  '/apps/questions': Questions,
  '/apps/flashcards': FlashCards,
  '/apps/quizzes': Quizzes,
  '/apps/ai-tutor': AiTutor,
  '/apps/find-tutors': FindTutors,
  '/apps/essay': Essay,
  '/apps/speech-to-text': SpeechToText,
  '/other/support': CustomerSupport,
  '/other/games': LearningGames,
  '/other/past-questions?type=past-questions': Questions,
  '/plan': Plan
}

const currentComponent = computed(() => {
  return componentsMap[route.path] || Dashboard
})
</script>
