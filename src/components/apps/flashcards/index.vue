<template>
  <div class="flex flex-col gap-4 lg:flex-row">
    <!-- Form Container -->
    <div
      v-if="!showFlashcardsContainer"
      class="flex w-full flex-col items-center gap-4"
    >
      <!-- Text Area -->
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Upload a document:</p>
        <strong>Accepted File Types: (.pdf, .docx)</strong>
      </div>

      <!-- File Upload Icon -->
      <div class="mt-2 flex gap-4">
        <UButton
          class="rounded-full bg-red-200 p-3 dark:bg-gray-700"
          @click="triggerFileInput"
        >
          <font-awesome-icon :icon="['fas', 'upload']" />
        </UButton>
      </div>
      <input
        type="file"
        id="file-upload"
        class="hidden"
        @change="e => handleFileUpload(e, updateMessageContent)"
      />

      <!-- Dropdown for Level -->
      <div class="mt-2 w-full">
        <select
          v-model="level"
          class="w-full rounded-2xl bg-white p-3 shadow dark:bg-[#111C44] dark:text-white"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <!-- Number Input for Total Questions -->
      <div class="mt-2 w-full">
        <input
          v-model.number="totalQuestions"
          type="number"
          min="1"
          max="50"
          class="w-full rounded-2xl bg-white p-3 shadow dark:bg-[#111C44] dark:text-white"
          placeholder="Enter total questions"
        />
      </div>

      <!-- Submit Button -->
      <UButton
        class="flex w-[200px] items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        variant="blue"
        :disabled="isLoading"
        @click="generateFlashcards"
      >
        {{ isLoading ? 'Generating...' : 'Generate Flashcards' }}
      </UButton>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Flashcards Container -->
    <div
      v-if="showFlashcardsContainer"
      class="w-full rounded-lg bg-white p-5 shadow-lg lg:w-[50%] dark:bg-[#111C44]"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold">Flashcards Preview</h2>
      </div>

      <div v-if="flashcards.length === 0" class="text-center text-gray-500">
        No flashcards generated yet.
      </div>

      <!-- Single Flashcard Display -->
      <div v-if="flashcards.length > 0" class="mx-auto w-full max-w-[300px]">
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
            class="rounded-lg bg-gray-500 px-4 py-2 text-white"
            @click="prevCard"
            :disabled="currentIndex === 0"
          >
            Back
          </UButton>
          <UButton
            class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { handleFileUpload } from '@/utils/extractText'

const messageContent = ref('')
const flashcards = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const level = ref('beginner')
const totalQuestions = ref('')
const isFlipped = ref(false)
const currentIndex = ref(0)
const showFlashcardsContainer = ref(false)

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

const generateFlashcards = async () => {
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
      showFlashcardsContainer.value = true
    } else {
      errorMessage.value = response.error
    }
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Trigger file input
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Update message content when a file is uploaded
const updateMessageContent = text => {
  messageContent.value = text
}
</script>
