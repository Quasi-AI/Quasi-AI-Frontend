<template>
  <div class="flex flex-col gap-4 lg:flex-row">
    <div class="flex w-full flex-col items-center gap-4 lg:w-[50%]">
      <!-- Text Area -->
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Please ensure your upload is in one of the following formats:</p>
        <div class="mt-2">
          <p>
            <strong>Accepted File Types: (.pdf *, .docx, .mp3, .wav)</strong>
          </p>
        </div>
      </div>

      <!-- File Icons -->
      <div class="mt-2 flex gap-4">
        <!-- Audio Recording Icon -->
        <UButton
          class="rounded-full bg-red-200 p-3 dark:bg-gray-700"
          @click="triggerFileInput"
        >
          <font-awesome-icon :icon="['fas', 'upload']" />
        </UButton>
      </div>

      <!-- Dropdown for Level -->
      <div class="mt-2 w-full">
        <select
          v-model="level"
          id="level"
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
          id="totalQuestions"
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
        :disabled="loading"
        @click="generateFlashcards"
      >
        <span v-if="!isLoading">Generate Flashcards</span>
        <span v-else class="flex items-center rounded-2xl">
          <CommonLoader class="h-5 w-5" />
        </span>
      </UButton>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Flashcards Preview -->
    <div
      class="flex w-full flex-col items-center overflow-y-auto md:h-[70vh] lg:h-[80vh] lg:w-[50%]"
    >
      <h2 class="mb-2 text-lg font-bold">Preview</h2>

      <div v-if="flashcards.length === 0" class="text-center text-gray-500">
        No flashcards generated yet.
      </div>

      <!-- Single Flashcard Display -->
      <div v-if="flashcards.length > 0" class="w-full max-w-[300px]">
        <div class="flip-card" @click="toggleFlip">
          <div class="flip-card-inner" :class="{ flipped: isFlipped }">
            <!-- Front (Question) -->
            <div class="flip-card-front">
              <h3 class="text-lg font-semibold text-white">
                {{ flashcards[currentIndex].front }}
              </h3>
            </div>
            <!-- Back (Answer) -->
            <div class="flip-card-back">
              <p class="text-lg text-white">
                {{ flashcards[currentIndex].back }}
              </p>
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
            class="flex w-[200px] items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
            variant="blue"
            @click="nextCard"
            :disabled="currentIndex === flashcards.length - 1"
          >
            Next
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Hidden File Input -->
  <input
    type="file"
    id="file-upload"
    style="display: none"
    @change="handleFileChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import PPTX2Json from 'pptx2json'
import axios from 'axios'

// Specify the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js'

// Add microphone icon to FontAwesome library
library.add(faMicrophone)

const messageContent = ref('')
const flashcards = ref([])
const loading = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const level = ref('beginner')
const totalQuestions = ref('')
const isFlipped = ref(false) // Track flip state for the current card
const currentIndex = ref(0) // Track the current flashcard index

// Toggle flip state for the current card
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

// Navigate to the previous card
const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isFlipped.value = false // Reset flip state
  }
}

// Navigate to the next card
const nextCard = () => {
  if (currentIndex.value < flashcards.value.length - 1) {
    currentIndex.value++
    isFlipped.value = false // Reset flip state
  }
}

// Trigger the hidden file input when the button is clicked
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Handle the file selection
const handleFileChange = async event => {
  const file = event.target.files[0]

  if (!file) return

  const fileType = file.type
  errorMessage.value = '' // Clear previous error message

  // PDF Handling
  if (fileType === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = async e => {
      const pdfData = new Uint8Array(e.target.result)
      const pdf = await pdfjsLib.getDocument(pdfData).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(item => item.str).join(' ') + '\n'
      }
      messageContent.value = text
    }
    reader.readAsArrayBuffer(file)
  } else if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const reader = new FileReader()
    reader.onload = e => {
      const arrayBuffer = e.target.result

      // Extract text from the Word document using Mammoth
      mammoth
        .extractRawText({ arrayBuffer: arrayBuffer })
        .then(result => {
          messageContent.value = result.value // Set the extracted text in the textarea
        })
        .catch(err => {
          console.error('Error extracting text from DOCX:', err)
        })
    }
    reader.readAsArrayBuffer(file)
  }

  // PPTX Handling (using pptx2json)
  else if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    const reader = new FileReader()

    reader.onload = async e => {
      const arrayBuffer = e.target.result

      try {
        // Parse the PPTX file
        const pptx = new PPTX2Json()
        pptx.load(arrayBuffer)

        // Extracting the slide content
        pptx
          .getSlides()
          .then(slides => {
            let text = ''
            slides.forEach(slide => {
              slide.texts.forEach(textItem => {
                text += textItem.text + ' '
              })
            })
            messageContent.value = text // Set the extracted text in the textarea
          })
          .catch(err => {
            console.error('Error extracting slides:', err)
          })
      } catch (err) {
        console.error('Error extracting text from PPTX:', err)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // Audio Handling (basic example, can be expanded with speech-to-text libraries)
  else if (fileType.startsWith('audio/')) {
    // Example: Extract metadata or transcribe audio (e.g., using Google Speech API)
    const text = 'Audio recording transcribed content'
    messageContent.value = text
  } else {
    errorMessage.value =
      'Unsupported file type. Please upload a PDF, DOCX, or Audio file.'
  }
}

const generateFlashcards = async () => {
  try {
    isLoading.value = true
    console.log('Generating Flashcards')

    // Create the request body
    const requestBody = {
      user_id: localStorage.getItem('user_id'),
      message: messageContent.value,
      level: level.value,
      totalQuestions: totalQuestions.value
    }

    // Make the API call using axios
    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/flashcards/generate',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    // Handle the response
    if (response.status === 200) {
      console.log('Flashcards generated:', response.data)
      flashcards.value = response.data.flashcards || []
      currentIndex.value = 0 // Reset to the first card
      isFlipped.value = false // Reset flip state
    } else {
      errorMessage.value = response.error
    }
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.flip-card {
  width: 100%;
  height: 50vh;
  perspective: 1000px;
}

.flip-card-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease-in-out;
  transform-style: preserve-3d;
  position: relative;
}

.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-size: 1rem;
  text-align: center;
  padding: 15px;
  overflow: auto;
  /* Allow scrolling if content overflows */
  word-wrap: break-word;
  /* Break long words to prevent overflow */
}

.flip-card-front {
  background-color: #2b6cb0;
  /* Blue for the front (question) */
  color: white;
  transform: rotateY(0deg);
  /* Ensure front is visible by default */
}

.flip-card-back {
  background-color: #38a169;
  /* Green for the back (answer) */
  color: white;
  transform: rotateY(180deg);
  /* Ensure back is hidden by default */
}

/* Ensure text fits within the card */
.flip-card-front h3,
.flip-card-back p {
  margin: 0;
  padding: 10px;
  max-width: 100%;
  /* Ensure text doesn't overflow horizontally */
  overflow-y: auto;
  /* Allow vertical scrolling if needed */
  word-break: break-word;
  /* Break long words to prevent overflow */
}
</style>
