<template>
  <div class="p-6">
    <!-- Filters -->
    <div
      class="mb-4 flex flex-col items-center justify-between gap-4 lg:flex-row"
    >
      <UInput
        variant="none"
        class="my-2 w-full rounded-lg bg-gray-200 p-1 pr-6 dark:bg-[#111C44] dark:text-white"
        placeholder="Enter Category, topic or subject"
        v-model="selectedCategory"
        maxLength="250"
      />
      <select
        v-model="selectedAge"
        class="my-2 w-full rounded-lg bg-gray-200 p-2 pr-6 dark:bg-[#111C44]"
      >
        <option value="">All Ages</option>
        <option v-for="age in ages" :key="age" :value="age">{{ age }}</option>
      </select>
      <select
        v-model="selectedLevel"
        class="my-2 w-full rounded-lg bg-gray-200 p-2 pr-6 dark:bg-[#111C44]"
      >
        <option value="">All Levels</option>
        <option v-for="level in levels" :key="level" :value="level">
          {{ level }}
        </option>
      </select>
      <button
        @click="generateFlashcards"
        class="flex w-[200px] items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-90 hover:bg-[#4A2DCA]"
        variant="blue"
      >
        Generate
      </button>
    </div>

    <!-- Flashcards (Show only if flashcards exist) -->
    <div
      v-if="flashcards.length > 0"
      class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(card, index) in flashcards"
        :key="index"
        @click="flipCard(index)"
        class="flex h-40 w-full transform cursor-pointer items-center justify-center rounded-xl bg-blue-500 p-4 text-center text-white transition-transform"
        :class="{ 'bg-green-500': card.flipped }"
        :style="{ animationDelay: `${index * 0.2}s` }"
      >
        <span v-if="!card.flipped">{{ card.front }}</span>
        <span v-else>{{ card.back }}</span>
      </div>
    </div>

    <!-- Empty State (Show when no flashcards are available) -->
    <div v-else-if="!loading" class="mt-4 text-center text-gray-500">
      No games flashcards available.
      <EmptyStateIcon width="100%" height="350px" />
    </div>

    <!-- Loading & Error Messages -->
    <div v-if="loading" class="mt-4 text-center">
      Loading games flashcards...
    </div>
    <div v-if="errorMessage" class="mt-4 text-center text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import EmptyStateIcon from '@/assets/icons/empty-state-icon.vue'

const selectedCategory = ref('')
const selectedAge = ref('')
const selectedLevel = ref('')
const flashcards = ref([])
const loading = ref(false)
const errorMessage = ref('')
const currentIndex = ref(0)

const ages = ['10+', '12+', '15+']
const levels = ['beginner', 'intermediate', 'advanced']

const flipCard = async index => {
  const card = flashcards.value[index]

  // Speak the flipped card
  speak(card.flipped ? card.front : card.back)

  // Toggle the flipped state
  card.flipped = !card.flipped

  // Wait for UI update, then speak the next card
  await nextTick()
  const nextCardIndex = index + 1
  if (nextCardIndex < flashcards.value.length) {
    speak(flashcards.value[nextCardIndex].front)
  }
}

const speak = text => {
  if (text) {
    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesis.speak(utterance)
  }
}

const generateFlashcards = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const requestBody = {
      user_id: localStorage.getItem('user_id'),
      category: selectedCategory.value,
      level: selectedLevel.value,
      age: selectedAge.value
    }

    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/game/generate',
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (response.status === 200) {
      flashcards.value = response.data.flashcards || []
      currentIndex.value = 0

      if (flashcards.value.length > 0) {
        speak(flashcards.value[0].front)
      }
    } else {
      errorMessage.value = response.data.error || 'Failed to fetch flashcards.'
    }
  } catch (err) {
    errorMessage.value =
      err.message || 'An error occurred while fetching flashcards.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  transition: background-color 0.3s ease-in-out;
}
</style>
