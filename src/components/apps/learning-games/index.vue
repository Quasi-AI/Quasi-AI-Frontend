<template>
  <div class="p-6">
    <!-- Filters -->
    <div class="mb-4 flex gap-4">
      <input
        v-model="selectedCategory"
        class="w-1/4 rounded-full border p-2"
        placeholder="Enter Category, topic or subject"
      />
      <select v-model="selectedAge" class="rounded border p-2">
        <option value="">All Ages</option>
        <option v-for="age in ages" :key="age" :value="age">{{ age }}</option>
      </select>
      <select v-model="selectedLevel" class="rounded border p-2">
        <option value="">All Levels</option>
        <option v-for="level in levels" :key="level" :value="level">
          {{ level }}
        </option>
      </select>
      <button
        @click="generateFlashcards"
        class="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Generate Games
      </button>
    </div>

    <!-- Flashcards -->
    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="(card, index) in flashcards"
        :key="index"
        @click="flipCard(index)"
        class="flex h-40 w-64 transform cursor-pointer items-center justify-center rounded-xl bg-blue-500 p-4 text-center text-white transition-transform hover:scale-105"
        :class="{ 'bg-green-500': card.flipped }"
      >
        <span v-if="!card.flipped">{{ card.front }}</span>
        <span v-else>{{ card.back }}</span>
      </div>
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
import { ref, nextTick } from 'vue'
import axios from 'axios'

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
