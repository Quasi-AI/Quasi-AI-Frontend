<template>
  <div class="flex flex-col gap-4 lg:flex-row">
    <!-- Form Container -->
    <div
      v-if="!showQuizzesContainer"
      class="flex w-full flex-col items-center gap-4"
    >
      <div class="flex items-center gap-4">
        <!-- Export Results -->
        <UButton
          v-if="score !== null"
          class="w-[200px] rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
          :disabled="loading"
          @click="exportResults"
        >
          Export Results
        </UButton>

        <!-- Score Display -->
        <div v-if="score !== null" class="text-lg font-bold">
          Your Score: {{ score }} / {{ quizes.length }}
        </div>
      </div>

      <!-- Text Area -->
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow-lg transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Upload a document:</p>
        <strong>Accepted File Types: (.pdf, .docx)</strong>
      </div>

      <!-- File Upload Button -->
      <div class="mt-2 flex gap-4">
        <UButton
          class="rounded-full bg-red-200 p-3 dark:bg-gray-700"
          @click="triggerFileInput"
        >
          <font-awesome-icon :icon="['fas', 'upload']" />
        </UButton>
      </div>
      <input
        id="file-upload"
        type="file"
        @change="e => handleFileUpload(e, updateMessageContent)"
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
        :class="{
          'w-full rounded-lg p-2 dark:bg-[#111C44] dark:text-white': true,
          'border border-red-500': hasError
        }"
        placeholder="Timer duration (minutes)"
      />
      <p v-if="hasError" class="mt-1 text-sm text-red-500">
        Please specify a valid timer duration.
      </p>

      <!-- Generate Quiz Button -->
      <UButton
        class="flex w-[200px] items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        variant="blue"
        :disabled="loading"
        @click="generateQuestions"
      >
        {{ loading ? 'Generating...' : 'Generate Quiz' }}
      </UButton>
    </div>

    <!-- Quiz Section -->
    <div v-if="showQuizzesContainer" class="flex w-full flex-col">
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
        <div class="space-y-4 overflow-y-auto p-2">
          <div
            v-for="(quiz, index) in quizes"
            :key="index"
            class="rounded-2xl bg-white p-4 shadow-lg dark:bg-[#111C44] dark:text-white"
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

        <!-- Submit Answers Button -->
        <UButton
          class="w-[200px] rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
          @click="checkAnswers"
          :disabled="score !== null"
        >
          Submit Answers
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleFileUpload } from '@/utils/extractText'

const messageContent = ref('')
const quizes = ref([])
const selectedLevel = ref('beginner')
const numQuestions = ref(10)
const loading = ref(false)
const score = ref(null)
const userTimer = ref()
const timer = ref(0)
const hasError = ref(false)
const showQuizzesContainer = ref(false)

let timerInterval

const startTimer = () => {
  timer.value = userTimer.value * 60
  timerInterval = setInterval(() => {
    if (timer.value > 0) timer.value--
    else {
      clearInterval(timerInterval)
      checkAnswers()
    }
  }, 1000)
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
      showQuizzesContainer.value = true
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

// Trigger the file input when the button is clicked
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Update message content when a file is uploaded
const updateMessageContent = text => {
  messageContent.value = text
}
</script>
