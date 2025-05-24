<template>
  <div
    class="mb-6 flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44] dark:text-white md:flex-row"
  >
    <div class="flex w-full items-center gap-4 md:w-auto">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-full bg-[#6366F1] text-lg font-bold text-white"
      >
        {{ initials }}
      </div>
      <div class="text-center md:text-left">
        <h2 class="text-lg font-semibold">{{ name }}</h2>
        <p class="text-sm text-gray-400">{{ email }}</p>
      </div>
    </div>
    <NuxtLink
      to="/apps"
      class="w-full rounded-md bg-[#6366F1] px-4 py-2 text-center text-white hover:bg-[#4F46E5] md:w-auto"
    >
      Go to Apps
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  }
})

const initials = computed(() => {
  const words = props.name.trim().split(' ')
  return words.length > 1
    ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
    : words[0][0].toUpperCase()
})
</script>
