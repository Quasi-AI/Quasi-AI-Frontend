<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <!-- Input Section -->
    <div class="flex w-full flex-col items-center gap-4 lg:w-[50%]">
      <div class="flex items-center gap-4">
        <!-- Export Results -->
        <UButton
          v-if="score !== null"
          class="rounded-2xl bg-[#5D3BEA] text-white"
          :disabled="loading"
          variant="blue"
          @click="exportResults"
        >
          Export Results
        </UButton>

        <!-- Score -->
        <div v-if="score !== null" class="text-lg font-bold">
          Your Score: {{ score }} / {{ quizes.length }}
        </div>
      </div>

      <!-- Text Area -->
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Please ensure your upload is in one of the following formats:</p>
        <p>
          <strong>Accepted File Types: (.pdf *, .docx)</strong>
        </p>
      </div>

      <!-- File Upload Button -->
      <UButton
        class="rounded-full bg-red-200 p-3 dark:bg-gray-700"
        @click="triggerFileInput"
      >
        <font-awesome-icon :icon="['fas', 'upload']" />
      </UButton>
      <input
        id="file-upload"
        type="file"
        @change="handleFileChange"
        class="hidden"
      />

      <!-- Level Selection -->
      <select
        v-model="selectedLevel"
        class="w-full rounded-lg p-2 dark:bg-[#111C44] dark:text-white"
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <!-- Number of Questions -->
      <input
        type="number"
        v-model="numQuestions"
        min="1"
        max="20"
        class="w-full rounded-lg p-2 dark:bg-[#111C44] dark:text-white"
        placeholder="Number of questions"
      />

      <!-- Timer Input -->
      <input
        type="number"
        v-model="userTimer"
        min="1"
        required
        :class="{
          'w-full rounded-lg p-2 dark:bg-[#111C44] dark:text-white': true,
          'border border-red-500': hasError
        }"
        placeholder="Timer duration (minutes)"
      />
      <p v-if="hasError" class="mt-1 text-sm text-red-500">
        Please specify a valid timer duration.
      </p>

      <!-- Generate Button -->
      <UButton
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="loading"
        variant="blue"
        @click="generateQuestions"
      >
        {{ loading ? 'Generating...' : 'Generate Quiz' }}
      </UButton>
    </div>

    <!-- Quiz Section -->
    <div class="flex w-full flex-col lg:w-[50%]">
      <h2 class="mb-2 text-lg font-bold">Quiz</h2>
      <div v-if="quizes.length === 0" class="text-gray-500">
        No quiz generated yet.
      </div>

      <div v-else class="space-y-4">
        <!-- Timer -->
        <div v-if="timer > 0" class="text-lg font-bold">
          Time Remaining: {{ Math.floor(timer / 60) }}:{{
            timer % 60 < 10 ? '0' : ''
          }}{{ timer % 60 }}
        </div>

        <!-- Questions -->
        <div
          class="h-[60vh] space-y-4 overflow-y-auto p-2 md:h-[70vh] lg:h-[80vh]"
        >
          <div
            v-for="(quiz, index) in quizes"
            :key="index"
            class="rounded-2xl bg-white p-4 shadow dark:bg-[#111C44] dark:text-white"
          >
            <p class="font-semibold">{{ index + 1 }}. {{ quiz.question }}</p>
            <div class="mt-2 flex flex-col gap-2">
              <label
                v-for="(option, optIndex) in quiz.options"
                :key="optIndex"
                class="flex items-center gap-2"
              >
                <input
                  type="radio"
                  :name="'question-' + index"
                  :value="option"
                  v-model="quiz.userAnswer"
                  :disabled="score !== null"
                />
                <span :class="getAnswerClass(quiz, option)">
                  {{ option }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <UButton
          class="rounded-2xl bg-[#5D3BEA] text-white"
          @click="checkAnswers"
          variant="blue"
          :disabled="score !== null"
        >
          Submit Answers
        </UButton>
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
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import PPTX2Json from 'pptx2json'

// Specify the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js'

const messageContent = ref('')
const quizes = ref([])
const selectedLevel = ref('beginner')
const numQuestions = ref(10)
const loading = ref(false)
const errorMessage = ref('')
const score = ref(null)
const userTimer = ref() // Default timer duration in minutes
const timer = ref(0) // Timer in seconds
const hasError = ref(false) // Track validation state

// Timer Logic
let timerInterval
const startTimer = () => {
  timer.value = userTimer.value * 60 // Convert minutes to seconds
  timerInterval = setInterval(() => {
    if (timer.value > 0) timer.value--
    else {
      clearInterval(timerInterval)
      checkAnswers() // Automatically submit answers when time runs out
    }
  }, 1000)
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

// Generate Quiz Questions using the new API
const generateQuestions = async () => {
  if (!userTimer.value || userTimer.value <= 0) {
    hasError.value = true // Show error styling
    return
  }
  hasError.value = false // Reset error when valid

  if (!messageContent.value.trim()) {
    quizes.value = [
      {
        question: 'Please provide content to generate quiz questions.',
        options: [],
        correctAnswer: ''
      }
    ]
    return
  }

  loading.value = true
  try {
    const response = await fetch(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/quizes/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent.value,
          level: selectedLevel.value,
          totalQuestions: numQuestions.value,
          user_timer: userTimer.value,
          user_id: localStorage.getItem('user_id')
        })
      }
    )

    if (!response.ok)
      throw new Error(`API request failed with status ${response.status}`)

    const data = await response.json()
    if (data?.quizes) {
      quizes.value = data.quizes.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: null
      }))
      startTimer() // Start timer
    } else {
      quizes.value = [
        {
          question: 'Failed to generate quiz questions.',
          options: [],
          correctAnswer: ''
        }
      ]
    }
  } catch (error) {
    console.error('Error:', error)
    quizes.value = [
      {
        question: 'Error generating quiz. Please try again.',
        options: [],
        correctAnswer: ''
      }
    ]
  } finally {
    loading.value = false
  }
}

// Check user answers
const checkAnswers = () => {
  let correctCount = 0
  quizes.value.forEach(quiz => {
    if (quiz.userAnswer === quiz.correctAnswer) correctCount++
  })
  score.value = correctCount
  clearInterval(timerInterval) // Stop timer
}

// Highlight correct and incorrect answers
const getAnswerClass = (quiz, option) => {
  if (score.value !== null) {
    const isCorrect = option === quiz.correctAnswer
    const isWrong = option === quiz.userAnswer && !isCorrect
    return {
      'text-green-600 font-bold': isCorrect,
      'text-red-600': isWrong
    }
  }
  return {}
}
</script>
