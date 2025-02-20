<template>
  <div class="mt-10 flex flex-col items-center justify-center">
    <div class="w-full text-center lg:w-[750px]">
      <h1 class="text-2xl font-extrabold">
        Transform your learning experience with
        <span class="font-extrabold text-[#5D3BEA]">Quasi AI</span>
      </h1>
      <p class="mt-4 break-words">
        Generate flashcards, quizzes, and study materials instantly from your
        lectures, notes, PDFs, and presentations.
      </p>
    </div>
    <div class="mt-8 flex gap-4">
      <NuxtLink to="/auth/login">
        <UButton variant="" class="rounded-2xl bg-[#5D3BEA] text-white">
          Start learning now
        </UButton>
      </NuxtLink>
      <UButton
        variant=""
        class="rounded-2xl bg-[#fff] text-[#5D3BEA] cursor-pointer"
        @click="playVideo"
      >
        Watch a demo
      </UButton>
    </div>
    <div class="mt-8 w-full flex justify-center">
      <div class="relative w-full max-w-[750px]">
        <template v-if="!videoPlaying">
          <!-- Placeholder using the imported VideoTmp component -->
          <div @click="playVideo" class="cursor-pointer">
            <VideoTmp ref="videoTempRef" class="h-auto w-full rounded-lg shadow-lg" />
          </div>
        </template>
        <template v-else>
          <!-- Video player with same dimensions as VideoTmp -->
          <video
            ref="videoElement"
            class="rounded-lg shadow-lg"
            :width="videoWidth"
            :height="videoHeight"
            controls
            autoplay
          >
            <source
              src="https://firebasestorage.googleapis.com/v0/b/park4me-b2127.appspot.com/o/Screen%20Recording%202025-02-20%20at%2003.46.55.mp4?alt=media&token=b14cf3d0-e451-4562-8391-ef07208ed5e5"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import VideoTmp from "~/assets/media/svgs/video-temp.vue"; 

const videoPlaying = ref(false);
const videoElement = ref(null);
const videoTempRef = ref(null);
const videoWidth = ref("100%");
const videoHeight = ref("auto");

const playVideo = () => {
  videoPlaying.value = true;
  setTimeout(() => {
    videoElement.value?.play();
  }, 100);
};

// Get placeholder dimensions
onMounted(() => {
  nextTick(() => {
    if (videoTempRef.value) {
      const tempElement = videoTempRef.value.$el;
      videoWidth.value = tempElement.clientWidth;
      videoHeight.value = tempElement.clientHeight;
    }
  });
});
</script>
