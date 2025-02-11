<template>
  <div
    class="mt-5 grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    <div
      v-for="(feature, index) in features"
      :key="index"
      @click="navigateTo(feature.route)"
      class="flex cursor-pointer flex-col gap-3 rounded-2xl p-4 transition hover:shadow-xl"
      :class="
        colorMode.value === 'dark' ? 'bg-[#111C44] text-white' : 'bg-white'
      "
    >
      <span
        class="flex w-20 items-center justify-center rounded-full p-5 text-4xl"
        :class="
          colorMode.value === 'dark'
            ? 'bg-[#111C44] text-white'
            : 'bg-[#F4F7FE]'
        "
      >
        {{ feature.icon }}
      </span>
      <h1
        class="font-medium"
        :class="colorMode.value === 'dark' ? 'text-white' : ''"
      >
        {{ feature.label }}
      </h1>
      <p>{{ feature.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const colorMode = useColorMode()

const features = [
  {
    label: 'Smart Flashcards',
    icon: '🃏',
    route: '/dashboard/flashcards',
    description:
      'AI-powered flashcard generation from your learning materials with spaced repetition.'
  },
  {
    label: 'Practice Quizzes',
    icon: '🔢',
    route: '/dashboard/quizzes',
    description:
      'Automatically generated quizzes to test understanding and track progress.'
  },
  {
    label: 'Questions',
    icon: '📝',
    route: '/dashboard/questions',
    description: 'Ask and answer questions from a large knowledge base.'
  },
  {
    label: 'AI Tutors',
    icon: '🤖',
    route: '/dashboard/ai-tutor',
    description:
      'Get instant explanations and answers to your questions about the material.'
  },
  {
    label: 'Find Tutors',
    icon: '👨‍🏫',
    route: '/dashboard/find-tutors',
    description: 'Connect with expert tutors for personalized learning.'
  },
  {
    label: 'Essay Analyzer',
    icon: '📝',
    route: '/dashboard/essay',
    description:
      'Get feedback on your essays, including grammar and structure improvements.'
  },
  {
    label: 'Speech to Text',
    icon: '🎤',
    route: '/dashboard/speech-to-text',
    description:
      'Convert spoken words into accurate text for learning and note-taking.'
  },
  {
    label: 'Plagiarism Checker',
    icon: '📝',
    route: '/dashboard/plagiarism',
    description:
      'Ensure originality in your writing with an AI-powered plagiarism detection tool.'
  }
]

const navigateTo = (route: string) => {
  router.push(route)
}
</script>
