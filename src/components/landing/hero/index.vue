<template>
  <div class="mt-10 flex flex-col items-center justify-center">
    <div class="w-full text-center lg:w-[750px]">
      <h1 class="text-2xl font-extrabold">
        Transform your learning experience with
        <span class="font-extrabold text-[#6BA7C4]">Quasi AI</span>
      </h1>
      <p class="mt-4 break-words">
        Generate flashcards, quizzies, and study materials instantly from your
        lectures, notes, pdfs, and presentations
      </p>
    </div>
    <div class="mt-8 flex gap-4">
      <NuxtLink to="/auth/login"
        ><UButton color="cyan">Start learning now</UButton></NuxtLink
      >
      <UButton color="white" class="text-blue">Watch a demo</UButton>
    </div>
    <div class="mt-8">
      <VideoTmp class="h-auto w-full" />
    </div>
  </div>
</template>

<script setup>
import VideoTmp from '~/assets/media/svgs/video-temp.vue'
</script>
