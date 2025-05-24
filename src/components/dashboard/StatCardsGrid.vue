<template>
  <div
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
  >
    <template v-if="isLoading">
      <!-- Skeleton Loaders -->
      <div
        v-for="n in 4"
        :key="n"
        class="animate-pulse rounded-lg bg-gray-200 p-4"
      >
        <div class="h-6 w-32 rounded bg-gray-300"></div>
        <div class="mt-2 h-10 w-20 rounded bg-gray-300"></div>
        <div class="mt-2 h-4 w-16 rounded bg-gray-300"></div>
      </div>
    </template>

    <template v-else>
      <!-- Actual Cards -->
      <StatCard
        v-for="(card, index) in cards"
        :key="index"
        :title="card.card_title"
        :value="card.card_value"
        :trend="card.card_trend"
        :trendColor="card.card_trend_color"
        :svg="svgIcons[index]"
      />
    </template>
  </div>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'
import QuestionSvg from '~/assets/icons/questionSvg.vue'
import FlashcardSvg from '~/assets/icons/flashcardSvg.vue'
import TotalLearnersSvg from '~/assets/icons/totallearnersSvg.vue'
import TutorsSvg from '~/assets/icons/tutorsSvg.vue'

const props = defineProps({
  cards: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const svgIcons = [FlashcardSvg, QuestionSvg, TotalLearnersSvg, TutorsSvg]
</script>
