<template>
  <div class="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
    <div
      v-for="(feature, index) in features"
      :key="index"
      @click="navigateTo(feature.route)"
      class="flex cursor-pointer items-start gap-4 rounded-lg p-6 hover:shadow-md dark:bg-[#111C44]"
      :class="feature.bgColor"
      :style="{ animationDelay: `${index * 0.2}s` }"
    >
      <!-- Icon -->
      <span
        class="flex shrink-0 items-center justify-center rounded-lg dark:backdrop-blur-sm"
      >
        <component :is="feature.icon" class="h-10 w-10" />
      </span>

      <!-- Content -->
      <div class="flex-1">
        <h3 class="text-xl font-bold">{{ feature.title }}</h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import LandingUiIconsFeaturesQuestions from '@/components/landing/ui/icons/features/questions.vue'
import LandingUiIconsFeaturesFlashcards from '@/components/landing/ui/icons/features/flashcards.vue'
import LandingUiIconsFeaturesTutors from '@/components/landing/ui/icons/features/tutors.vue'
import LandingUiIconsFeaturesAitutors from '@/components/landing/ui/icons/features/aitutors.vue'
import LandingUiIconsFeaturesQuizzes from '@/components/landing/ui/icons/features/quizzes.vue'
import LandingUiIconsFeaturesEssay from '@/components/landing/ui/icons/features/essay.vue'
import LandingUiIconsFeaturesSpeech from '@/components/landing/ui/icons/features/speech.vue'

const router = useRouter()

const features = ref([
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
    icon: LandingUiIconsFeaturesEssay,
    title: 'Essay Analyzer',
    description:
      'Get feedback on your essays, including grammar and structure improvements.',
    route: '/apps/essay',
    bgColor: 'bg-[#FFF0F0] dark:bg-[#352F44]'
  },
  {
    icon: LandingUiIconsFeaturesQuizzes,
    title: 'Practice Quizzes',
    description:
      'Automatically generated quizzes to test understanding and track progress.',
    route: '/apps/quizzes',
    bgColor: 'bg-[#F5F7FA] dark:bg-[#232D4B]'
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
    route: '/other/support',
    bgColor: 'bg-[#FFEEE8] dark:bg-[#3B3B5F]'
  }
])

const navigateTo = route => {
  if (route) router.push(route)
}
</script>
