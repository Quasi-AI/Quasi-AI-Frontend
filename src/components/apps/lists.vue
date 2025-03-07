<template>
  <div class="flex flex-col items-center px-4 py-10 lg:px-0">
    <div class="mt-10 grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-3">
      <div
        v-for="(feature, index) in features"
        :key="index"
        @click="navigateTo(feature.route)"
        class="flex cursor-pointer items-center gap-4 rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-[#111C44]"
        :class="feature.bgColor"
        :style="{ 'animation-delay': `${index * 0.2}s` }"
        v-animate-onscroll="'slide-up'"
      >
        <!-- Icon Container with Blur in Dark Mode -->
        <span
          class="flex items-center justify-center rounded-lg"
          :class="['dark:backdrop-blur-sm']"
        >
          <component :is="feature.icon" class="h-10 w-10" />
        </span>

        <div class="mt-4">
          <h3 class="text-xl font-bold">{{ feature.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ feature.description }}
          </p>
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
import LandingUiIconsFeaturesSpeech from '@/components/landing/ui/icons/features/speech.vue'

const router = useRouter()

const features = [
  {
    icon: LandingUiIconsFeaturesQuestions,
    title: 'Questions',
    description: 'Ask and answer questions from a large knowledge base.',
    route: '/apps/questions',
    bgColor: 'bg-[#EBEBFF] dark:bg-[#1E2A5A]'
  },
  {
    icon: LandingUiIconsFeaturesFlashcards,
    title: 'Smart Flashcards',
    description:
      'AI-powered flashcard generation from your learning materials with spaced repetition.',
    route: '/apps/flashcards',
    bgColor: 'bg-[#FFF2E5] dark:bg-[#2C2C54]'
  },
  {
    icon: LandingUiIconsFeaturesTutors,
    title: 'Tutors',
    description:
      'Create expert tutors and connect them to students for personalized learning.',
    route: '/apps/find-tutors',
    bgColor: 'bg-[#FFEEE8] dark:bg-[#3B3B5F]'
  },
  {
    icon: LandingUiIconsFeaturesAitutors,
    title: 'AI Tutors',
    description:
      'Get instant explanations and answers to your questions about the material.',
    route: '/apps/ai-tutor',
    bgColor: 'bg-[#FFFFFF] dark:bg-[#21263A]'
  },
  {
    icon: LandingUiIconsFeaturesEssay,
    title: 'Practice Quizzes',
    description:
      'Automatically generated quizzes to test understanding and track progress.',
    route: '/apps/quizzes',
    bgColor: 'bg-[#F5F7FA] dark:bg-[#232D4B]'
  },
  {
    icon: LandingUiIconsFeaturesQuizzes,
    title: 'Essay Analyzer',
    description:
      'Get feedback on your essays, including grammar and structure improvements.',
    route: '/apps/essay',
    bgColor: 'bg-[#FFF0F0] dark:bg-[#352F44]'
  },
  {
    icon: LandingUiIconsFeaturesSpeech,
    title: 'Text to Speech',
    description:
      'Convert spoken words into accurate text for learning and note-taking purposes.',
    route: '/apps/speech-to-text',
    bgColor: 'bg-[#EBEBFF] dark:bg-[#1E2A5A]'
  },
  {
    icon: LandingUiIconsFeaturesTutors,
    title: 'Customer Support',
    description:
      'We offer live chat support and encourage you to send us feedback to ensure uninterrupted service.',
    route: '/apps/support',
    bgColor: 'bg-[#FFEEE8] dark:bg-[#3B3B5F]'
  }
]

const navigateTo = route => {
  if (route) router.push(route)
}
</script>
