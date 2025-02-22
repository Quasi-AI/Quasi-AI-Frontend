<template>
  <div
    class="container mx-auto my-5 grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
  >
    <div
      v-for="(feature, index) in features"
      :key="index"
      @click="navigateTo(feature.route)"
      class="flex cursor-pointer flex-col gap-3 rounded-2xl bg-white p-4 transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
    >
      <span
        class="flex w-20 items-center justify-center rounded-full bg-[#F4F7FE] p-5 dark:bg-[#0C1438]"
      >
        <component
          :is="feature.icon"
          class="h-10 w-10 text-gray-700 dark:text-white"
        />
      </span>
      <h1 class="font-medium dark:text-white">
        {{ feature.label }}
      </h1>
      <p>{{ feature.description }}</p>
    </div>
  </div>
  <div class="my-10 flex items-center justify-center">
    <NuxtLink to="/auth/login">
      <UButton
        variant="none"
        class="flex w-fit items-center justify-center rounded-2xl bg-[#5D3BEA] text-white lg:w-[400px]"
        >See more</UButton
      >
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  DocumentTextIcon,
  ClipboardIcon,
  ChatBubbleBottomCenterTextIcon,
  BoltIcon,
  UserGroupIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const features = [
  {
    label: 'Smart Flashcards',
    icon: DocumentTextIcon,
    route: '/dashboard/flashcards',
    description:
      'AI-powered flashcard generation from your learning materials with spaced repetition.'
  },
  {
    label: 'Practice Quizzes',
    icon: ClipboardIcon,
    route: '/dashboard/quizzes',
    description:
      'Automatically generated quizzes to test understanding and track progress.'
  },
  {
    label: 'Questions',
    icon: ChatBubbleBottomCenterTextIcon,
    route: '/dashboard/questions',
    description: 'Ask and answer questions from a large knowledge base.'
  },
  {
    label: 'AI Tutors',
    icon: BoltIcon,
    route: '/dashboard/ai-tutor',
    description:
      'Get instant explanations and answers to your questions about the material.'
  },
  {
    label: 'Find Tutors',
    icon: UserGroupIcon,
    route: '/dashboard/find-tutors',
    description: 'Connect with expert tutors for personalized learning.'
  },
  {
    label: 'Essay Analyzer',
    icon: PencilSquareIcon,
    route: '/dashboard/essay',
    description:
      'Get feedback on your essays, including grammar and structure improvements.'
  }
]

const navigateTo = (route: string) => {
  router.push(route)
}
</script>
