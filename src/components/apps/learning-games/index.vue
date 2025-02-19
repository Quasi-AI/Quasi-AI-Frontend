<template>
  <div class="p-6">
    <!-- Filters -->
    <div class="mb-4 flex gap-4">
      <select v-model="selectedCategory" class="rounded border p-2">
        <option value="">All Categories</option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
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
        @click="fetchFlashcards"
        class="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Generate
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
        <span v-if="!card.flipped">{{ card.question }}</span>
        <span v-else>{{ card.answer }}</span>
      </div>
    </div>

    <!-- Loading & Error Messages -->
    <div v-if="loading" class="mt-4 text-center">Loading flashcards...</div>
    <div v-if="errorMessage" class="mt-4 text-center text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
const selectedCategory = ref('')
const selectedAge = ref('')
const selectedLevel = ref('')
const flashcards = ref([])
const loading = ref(false)
const errorMessage = ref('')

const categories = [
  'Geography',
  'Mathematics',
  'Literature',
  'Science',
  'History',
  'Technology'
]
const ages = ['10+', '12+', '15+']
const levels = ['Beginner', 'Intermediate', 'Advanced']

const fetchFlashcards = async () => {
  loading.value = true
  errorMessage.value = ''

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Generate 10 educational flashcards based on these criteria:\n
              - Category: ${selectedCategory.value}\n
              - Age Group: ${selectedAge.value}\n
              - Difficulty Level: ${selectedLevel.value}\n
              Each flashcard should have a question and an answer in the format:
              Q: [Question]
              A: [Answer]`
          }
        ]
      }
    ]
  }

  try {
    const response = await fetch(
      useRuntimeConfig().public.GOOGLE_GEMINI_API_KEY,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      }
    )

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    flashcards.value = parseFlashcards(generatedText)

    if (flashcards.value.length === 0) {
      errorMessage.value = 'No flashcards generated. Try different filters.'
    }
  } catch (error) {
    errorMessage.value = 'Error fetching flashcards.'
  } finally {
    loading.value = false
  }
}

const parseFlashcards = text => {
  const flashcards = []
  const lines = text.split('\n')

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('Q:')) {
      const question = lines[i].replace('Q:', '').trim()
      const answer = (lines[i + 1] || '').replace('A:', '').trim()
      if (question && answer) {
        flashcards.push({ question, answer, flipped: false })
      }
    }
  }
  return flashcards
}

const flipCard = index => {
  flashcards.value[index].flipped = !flashcards.value[index].flipped
  speak(
    flashcards.value[index].flipped
      ? flashcards.value[index].answer
      : flashcards.value[index].question
  )
}

const speak = text => {
  const utterance = new SpeechSynthesisUtterance(text)
  speechSynthesis.speak(utterance)
}
</script>

<style scoped>
.card {
  transition: background-color 0.3s ease-in-out;
}
</style>
