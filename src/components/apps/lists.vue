<template>
  <div class="flex flex-col items-center px-4 py-20 lg:px-0">
    <div class="mt-10 grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-3">
      <div
        v-for="(feature, index) in features"
        :key="index"
        @click="navigateTo(feature.route)"
        class="flex cursor-pointer items-center gap-4 rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        :class="feature.bgColor"
        :style="{ 'animation-delay': `${index * 0.2}s` }"
        v-animate-onscroll="'slide-up'"
      >
        <component :is="feature.icon" class="h-10 w-10" />
        <div class="mt-4">
          <h3 class="text-xl font-bold">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LandingUiIconsFeaturesQuestions from '@/components/landing/ui/icons/features/questions.vue'
import LandingUiIconsFeaturesFlashcards from '@/components/landing/ui/icons/features/flashcards.vue'
import LandingUiIconsFeaturesTutors from '@/components/landing/ui/icons/features/tutors.vue'
import LandingUiIconsFeaturesAitutors from '@/components/landing/ui/icons/features/aitutors.vue'
import LandingUiIconsFeaturesQuizzes from '@/components/landing/ui/icons/features/quizzes.vue'
import LandingUiIconsFeaturesEssay from '@/components/landing/ui/icons/features/essay.vue'

const router = useRouter()

const features = [
  {
    icon: LandingUiIconsFeaturesQuestions,
    title: 'Questions',
    description: '63,476 questions',
    route: '/apps/questions',
    bgColor: 'bg-[#EBEBFF]'
  },
  {
    icon: LandingUiIconsFeaturesFlashcards,
    title: 'Smart Flashcards',
    description: 'About 2,736 cards',
    route: '/apps/flashcards',
    bgColor: 'bg-[#FFF2E5]'
  },
  {
    icon: LandingUiIconsFeaturesTutors,
    title: 'Find Tutors',
    description: 'More than you imagine',
    route: '/apps/find-tutors',
    bgColor: 'bg-[#FFEEE8]'
  },
  {
    icon: LandingUiIconsFeaturesAitutors,
    title: 'AI Tutors',
    description: 'Instant explanations & help',
    route: '/apps/ai-tutor',
    bgColor: 'bg-[#FFFFFF]'
  },
  {
    icon: LandingUiIconsFeaturesQuizzes,
    title: 'Practice Quizzes',
    description: 'About 13,932 quizzes',
    route: '/apps/quizzes',
    bgColor: 'bg-[#F5F7FA]'
  },
  {
    icon: LandingUiIconsFeaturesEssay,
    title: 'Essay Analyzer',
    description: '22,649 essays',
    route: '/apps/essay',
    bgColor: 'bg-[#FFF0F0]'
  }
]

const navigateTo = route => {
  if (route) router.push(route)
}
</script>
