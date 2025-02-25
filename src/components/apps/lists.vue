<template>
  <div
    class="mt-5 grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  DocumentTextIcon,
  ClipboardIcon,
  ChatBubbleBottomCenterTextIcon,
  BoltIcon,
  UserGroupIcon,
  PencilSquareIcon,
  MicrophoneIcon,
  DocumentDuplicateIcon,
  PhoneArrowDownLeftIcon
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
  },
  {
    label: 'Speech to Text',
    icon: MicrophoneIcon,
    route: '/dashboard/speech-to-text',
    description:
      'Convert spoken words into accurate text for learning and note-taking.'
  },
  {
    label: 'Plagiarism Checker',
    icon: DocumentDuplicateIcon,
    route: '/dashboard/plagiarism',
    description:
      'Ensure originality in your writing with an AI-powered plagiarism detection tool.'
  },
  {
    label: '24/7 Support',
    icon: PhoneArrowDownLeftIcon,
    route: '/dashboard/support',
    description:
      'We offer live chat support and encourage you to send us feedback to ensure uninterrupted service.'
  }
]

const navigateTo = (route: string) => {
  router.push(route)
}
</script>
