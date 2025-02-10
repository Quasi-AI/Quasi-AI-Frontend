<template>
  <h1 class="mt-4 text-center text-2xl font-bold">Everything you need</h1>
  <div
    class="mt-5 flex flex-col items-center justify-center space-y-8 md:flex-row md:space-x-8 md:space-y-0"
  >
    <div
      class="flex w-[370px] flex-col space-y-4 rounded-lg bg-white p-4 shadow-lg"
    >
      <FlashCards />
      <h1 class="text-[#4e90b1]">Smart Flashcards</h1>
      <p>
        AI-powered flashcard generation from your learning materials with spaced
        repetition.
      </p>
    </div>
    <div
      class="flex w-[370px] flex-col space-y-4 rounded-lg bg-white p-4 shadow-lg"
    >
      <Quizzes />
      <h1 class="text-[#4e90b1]">Practice Quizzes</h1>
      <p>
        Automatically generated quizzes to test understanding and track
        progress.
      </p>
    </div>
    <div
      class="flex w-[370px] flex-col space-y-4 rounded-lg bg-white p-4 shadow-lg"
    >
      <AiTutor />
      <h1 class="text-[#4e90b1]">AI Tutors</h1>
      <p>
        Get instant explanations and answers to your questions about the
        material
      </p>
    </div>
  </div>
  <div class="my-10 flex items-center justify-center">
    <NuxtLink to="/auth/login"
      ><UButton
        color="cyan"
        class="flex w-fit items-center justify-center lg:w-[420px]"
      >
        Start Learning now
      </UButton></NuxtLink
    >
  </div>
</template>

<script setup lang="ts">
import AiTutor from '~/assets/media/svgs/apps/ai-tutor.vue'
import FlashCards from '~/assets/media/svgs/apps/flash-cards.vue'
import Quizzes from '~/assets/media/svgs/apps/quizzes.vue'
</script>
