<template>
  <div class="flex flex-col gap-4 lg:h-screen">
    <!-- Home -->
    <div v-if="showHomeFlashcards" class="w-full">
      <div
        class="flex w-full flex-col items-center justify-end gap-2 p-8 lg:flex-row"
      >
        <UInput
          variant="none"
          class="my-2 w-full rounded-lg border bg-white p-1 lg:w-[200px] dark:border-none dark:bg-[#111C44]"
          placeholder="Search for flashcards by name"
          v-model="selectedCategory"
          maxLength="250"
        />
        <select
          v-model="filterFlashcards"
          class="my-2 w-full rounded-lg border bg-white p-2 lg:w-[200px] dark:border-none dark:bg-[#111C44]"
        >
          <option value="">All Flashcards</option>
          <option v-for="flash in flashcardsLists" :key="flash" :value="flash">
            {{ flash }}
          </option>
        </select>
        <button
          @click="HandleCreateFlashcardsButton"
          class="flex w-full items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-90 hover:bg-[#4A2DCA] lg:w-[200px]"
          variant="blue"
        >
          Create flashcards
        </button>
      </div>

      <!-- Empty State (Show when no flashcards are available) -->
      <div class="mt-4 text-center text-gray-500">
        No flashcards available.
        <EmptyStateIcon width="100%" height="350px" />
      </div>
    </div>

    <!-- Form Container -->
    <div
      v-if="showCreateFlashcards"
      class="mx-auto w-full rounded-xl bg-white p-8 dark:bg-[#111C44] dark:text-white"
    >
      <!-- Upload File -->
      <div
        @click="triggerFileInput"
        class="rounded-lg border-2 border-dashed border-blue-300 p-6 text-center"
      >
        <p class="font-medium text-gray-500">
          Click or drag and drop to upload your document
        </p>
        <p class="mt-1 text-sm text-gray-400">
          Accepted File Types: (.pdf, .docx)
        </p>
        <input
          id="file-upload"
          type="file"
          class="hidden"
          @change="handleFileUploadWrapper"
        />
      </div>

      <!-- Content Text Area -->
      <div class="mt-6">
        <p class="mb-2 block font-medium text-gray-500">Content</p>
        <textarea
          v-model="messageContent"
          class="h-40 w-full rounded-lg border p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          placeholder="Enter your detailed content here"
        />
      </div>

      <!-- Difficulty & Number of Questions -->
      <div class="mt-4 flex flex-col gap-4 lg:flex-row">
        <div class="w-full">
          <p class="mb-2 block font-medium text-gray-500">Difficulty level</p>
          <select
            v-model="level"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div class="w-full">
          <p class="mb-2 block font-medium text-gray-500">
            Number of questions
          </p>
          <input
            type="number"
            v-model.number="totalQuestions"
            min="1"
            max="50"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
            placeholder="Enter total questions"
          />
        </div>
      </div>

      <!-- Generate Button -->
      <div class="mt-6 flex justify-center">
        <button
          class="w-full max-w-xs rounded-lg bg-[#5D3BEA] py-3 font-medium text-white transition duration-300 hover:bg-[#4A2DCA] focus:ring-4 focus:ring-indigo-300"
          :disabled="isLoading"
          @click="generateFlashcards"
        >
          {{ isLoading ? 'Generating...' : 'Generate Flashcards' }}
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 text-center text-red-500">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Flashcards Container -->
    <div
      v-if="showPreviewFlashcards"
      class="w-full rounded-lg bg-white p-5 shadow-lg dark:bg-[#111C44]"
    >
      <div v-if="flashcards.length === 0" class="text-center text-gray-500">
        No flashcards generated yet.
      </div>

      <!-- Single Flashcard Display -->
      <div v-if="flashcards.length > 0" class="mx-auto w-full">
        <div class="perspective relative h-[50vh] w-full" @click="toggleFlip">
          <div
            class="preserve-3d relative h-full w-full transform transition-transform duration-500"
            :class="{ 'rotate-y-180': isFlipped }"
          >
            <!-- Front (Question) -->
            <div
              class="backface-hidden absolute inset-0 flex h-full w-full items-center justify-center rounded-lg bg-blue-600 p-5 text-white transition-transform"
              :class="{ hidden: isFlipped, block: !isFlipped }"
            >
              <h3 class="text-lg font-semibold">
                {{ flashcards[currentIndex].front }}
              </h3>
            </div>

            <!-- Back (Answer) -->
            <div
              class="backface-hidden rotate-y-180 absolute inset-0 flex h-full w-full items-center justify-center rounded-lg bg-green-600 p-5 text-white transition-transform"
              :class="{ hidden: !isFlipped, block: isFlipped }"
            >
              <p class="text-lg">{{ flashcards[currentIndex].back }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-4 flex justify-between">
          <UButton
            class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            variant="none"
            @click="prevCard"
            :disabled="currentIndex === 0"
          >
            Back
          </UButton>
          <UButton
            class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            variant="none"
            @click="nextCard"
            :disabled="currentIndex === flashcards.length - 1"
          >
            Next
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { handleFileUpload } from '@/utils/extractText'
import EmptyStateIcon from '@/assets/icons/empty-state-icon.vue'

const messageContent = ref('')
const flashcards = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const level = ref('beginner')
const totalQuestions = ref('')
const isFlipped = ref(false)
const currentIndex = ref(0)
const showCreateFlashcards = ref(false)
const showPreviewFlashcards = ref(false)
const showHomeFlashcards = ref(true)

// Filters
const filterFlashcards = ref('')
const flashcardsLists = ['My flashcards']

// Toggle flip state for the current card
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

// Navigate to previous card
const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isFlipped.value = false
  }
}

// Navigate to next card
const nextCard = () => {
  if (currentIndex.value < flashcards.value.length - 1) {
    currentIndex.value++
    isFlipped.value = false
  }
}

const HandleCreateFlashcardsButton = async () => {
  showHomeFlashcards.value = false
  showCreateFlashcards.value = true
  showPreviewFlashcards.value = false
}

const generateFlashcards = async () => {
  showHomeFlashcards.value = false

  try {
    isLoading.value = true

    const requestBody = {
      user_id: localStorage.getItem('user_id'),
      message: messageContent.value,
      level: level.value,
      totalQuestions: totalQuestions.value
    }

    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/flashcards/generate',
      requestBody,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (response.status === 200) {
      flashcards.value = response.data.flashcards || []
      currentIndex.value = 0
      isFlipped.value = false
      showPreviewFlashcards.value = true
      showHomeFlashcards.value = false
      showCreateFlashcards.value = false
    } else {
      errorMessage.value = response.error
    }
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Trigger the file input when the button is clicked
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Update message content when a file is uploaded
const updateMessageContent = text => {
  messageContent.value = text
}

const handleFileUploadWrapper = async event => {
  await handleFileUpload(event, updateMessageContent)
}
</script>
