<template>
  <div
    class="flex max-h-[880px] flex-col overflow-y-auto rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44] dark:text-white lg:row-span-2"
  >
    <h2 class="mb-4 text-lg font-semibold">Recent Flashcards</h2>
    <ul class="flex-1 overflow-y-auto">
      <template v-if="flashcards?.length">
        <li
          v-for="(flashcard, index) in flashcards"
          :key="index"
          class="flex items-center justify-between border-b border-gray-300 py-2 text-sm dark:border-gray-700"
        >
          <div class="flex items-center gap-2">
            <TutorsSvg class="h-4 w-4 text-gray-500 dark:text-gray-300" />
            <span>{{ flashcard.title }}</span>
          </div>
          <span class="text-xs text-gray-400 dark:text-gray-300">
            {{ formatTimeAgo(flashcard.createdAt) }}
          </span>
        </li>
      </template>
      <div v-else class="mt-4 text-center text-gray-500">
        No Flashcard
        <EmptyStateIcon width="100%" height="350px" />
      </div>
    </ul>
  </div>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeAgo.ts'
import TutorsSvg from '~/assets/icons/tutorsSvg.vue'
import EmptyStateIcon from '@/assets/icons/empty-state-icon.vue'

defineProps({
  flashcards: {
    type: Array,
    default: () => []
  }
})
</script>
