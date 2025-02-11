<template>
  <h1 class="mt-4 text-center text-2xl font-bold">Everything you need</h1>
  <div
    class="mt-5 flex flex-col items-center justify-center space-y-8 md:flex-row md:space-x-8 md:space-y-0"
  >
    <div
      v-for="(item, index) in features"
      :key="index"
      class="flex w-[370px] flex-col space-y-4 rounded-lg bg-white p-4 shadow-lg"
    >
      <component :is="item.icon" />
      <h1 class="text-[#5D3BEA]">{{ item.title }}</h1>
      <p>{{ item.description }}</p>
    </div>
  </div>
  <div class="my-10 flex items-center justify-center">
    <NuxtLink to="/dashboard">
      <UButton
        variant=""
        class="flex w-fit items-center justify-center rounded-2xl bg-[#5D3BEA] text-white lg:w-[400px]"
        >Start learning now</UButton
      >
    </NuxtLink>
  </div>
</template>

<script setup>
import AiTutor from '~/assets/media/svgs/apps/ai-tutor.vue'
import FlashCards from '~/assets/media/svgs/apps/flash-cards.vue'
import Quizzes from '~/assets/media/svgs/apps/quizzes.vue'

const features = [
  {
    icon: FlashCards,
    title: 'Smart Flashcards',
    description:
      'AI-powered flashcard generation from your learning materials with spaced repetition.'
  },
  {
    icon: Quizzes,
    title: 'Practice Quizzes',
    description:
      'Automatically generated quizzes to test understanding and track progress.'
  },
  {
    icon: AiTutor,
    title: 'AI Tutors',
    description:
      'Get instant explanations and answers to your questions about the material.'
  }
]
</script>
