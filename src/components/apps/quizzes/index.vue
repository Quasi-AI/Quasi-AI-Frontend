<template>
  <div class="flex flex-col gap-4 lg:h-screen">
    <!-- Form Container -->
    <div
      v-if="showHomeQuizzes"
      class="mx-auto w-full rounded-xl bg-white p-8 shadow-sm dark:bg-[#111C44] dark:text-white"
    >
      <!-- Text Area for Content -->
      <div class="mb-6">
        <p class="mb-2 block font-medium text-gray-500">Quiz Content</p>
        <textarea
          v-model="messageContent"
          class="h-40 w-full rounded-lg border p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          placeholder="Type your content here"
        />
      </div>

      <!-- File Upload -->
      <div
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @drop.prevent="handleDropWrapper"
        class="mb-6 cursor-pointer rounded-lg border-2 border-dashed border-blue-300 p-6 text-center"
      >
        <p class="font-medium text-gray-500">
          Click or drag and drop to upload a document
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

      <!-- Quiz Settings -->
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-2 block font-medium text-gray-500">Difficulty Level</p>
          <select
            v-model="selectedLevel"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <p class="mb-2 block font-medium text-gray-500">
            Number of Questions
          </p>
          <input
            type="number"
            v-model="numQuestions"
            min="1"
            max="20"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          />
        </div>

        <div>
          <p class="mb-2 block font-medium text-gray-500">
            Timer Duration (minutes)
          </p>
          <input
            type="number"
            v-model="userTimer"
            min="1"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          />
        </div>
      </div>

      <!-- Generate Quiz Button -->
      <div class="mt-6 flex justify-center">
        <button
          class="w-full max-w-xs rounded-lg bg-[#5D3BEA] py-3 font-medium text-white transition duration-300 hover:bg-[#4A2DCA] focus:ring-4 focus:ring-indigo-300"
          :disabled="loading"
          @click="generateQuestions"
        >
          {{ loading ? 'Generating...' : 'Generate Quiz' }}
        </button>
      </div>
    </div>

    <!-- Quiz Section -->
    <div v-if="showGeneratedQuizzes" class="flex w-full flex-col text-center">
      <div v-if="quizes.length === 0" class="text-gray-500">
        No quiz generated yet.
      </div>

      <div v-else class="space-y-4">
        <div
          class="flex flex-col items-center justify-between gap-4 py-4 lg:flex-row"
        >
          <div class="flex items-center justify-between gap-6">
            <div v-if="timer > 0" class="text-lg font-bold">
              Time: {{ Math.floor(timer / 60) }}:{{ timer % 60 < 10 ? '0' : ''
              }}{{ timer % 60 }}
            </div>

            <div
              v-if="score !== null"
              class="flex items-center justify-between"
            >
              <div class="text-lg font-bold">
                Your Score: {{ score }} / {{ quizes.length }}
              </div>
            </div>
          </div>

          <!-- Share Button -->
          <div class="w-full">
            <div v-if="score !== null" class="my-4 flex w-full justify-end">
              <UButton
                variant="blue"
                class="flex w-[180px] items-center justify-end rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:bg-[#4A2DCA]"
              >
                Share with students
              </UButton>
            </div>
          </div>
        </div>

        <div class="p-4">
          <div
            class="rounded-lg bg-white p-4 dark:bg-[#111C44] dark:text-white"
          >
            <p class="text-center font-semibold">
              {{ quizes[currentIndex].question }}
            </p>
          </div>

          <div
            class="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-white p-4 dark:bg-[#111C44] dark:text-white"
          >
            <p
              v-for="(option, index) in quizes[currentIndex].options"
              :key="index"
              class="flex cursor-pointer items-center gap-2 rounded-lg border p-2 hover:bg-gray-100 dark:border-[#0C1438] dark:hover:bg-gray-700"
              :class="{
                'border-2 border-[#5D3BEA]':
                  option === quizes[currentIndex].userAnswer && score === null,
                ...getAnswerClass(quizes[currentIndex], option)
              }"
              @click="selectAnswer(quizes[currentIndex], option)"
            >
              <input
                type="radio"
                :name="'question-' + currentIndex"
                :value="option"
                v-model="quizes[currentIndex].userAnswer"
                :disabled="score !== null"
                class="hidden"
              />
              <span class="flex h-full w-full items-center justify-center">
                {{ option }}
              </span>
            </p>
          </div>
        </div>

        <div
          class="flex w-full flex-col items-center justify-center gap-5 lg:flex-row"
        >
          <UButton
            v-if="currentIndex > 0"
            class="flex w-[200px] items-center justify-center rounded-md border border-[#5D3BEA] bg-white px-6 py-2 text-[#5D3BEA] transition hover:scale-105 hover:bg-gray-300"
            @click="prevQuestion"
            variant="none"
          >
            Previous
          </UButton>
          <UButton
            v-if="currentIndex < quizes.length - 1"
            class="flex w-[200px] items-center justify-center rounded-md bg-[#5D3BEA] px-6 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            @click="nextQuestion"
            variant="none"
          >
            Continue
          </UButton>
          <UButton
            v-if="currentIndex === quizes.length - 1"
            class="flex w-[200px] items-center justify-center rounded-md bg-[#5D3BEA] px-6 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            @click="checkAnswers"
            :disabled="score !== null"
            variant="none"
          >
            Submit Answers
          </UButton>
        </div>
      </div>
    </div>

    <div
      v-if="showPostSubmission"
      class="mx-auto flex w-full flex-col items-center justify-center rounded-xl"
    >
      <div class="w-[280px] text-center">
        <h2 class="mb-4 text-4xl font-extrabold text-[#5D3BEA]">
          Congratulations
        </h2>
        <p class="mb-6">
          Awesome job completing your quiz. You can review your performance or
          take a new quiz.
        </p>
        <div class="mb-6 flex items-center justify-center text-4xl">
          <img
            src="~/assets/icons/congrats-icon.gif"
            alt=""
            class="w-[200px]"
          />
        </div>
        <div class="flex flex-col items-center justify-center gap-4">
          <button
            class="w-[250px] rounded-md border border-[#5D3BEA] bg-white px-6 py-2 text-[#5D3BEA] transition hover:scale-105 hover:bg-gray-300"
            @click="retakeQuiz"
          >
            Take a new quiz
          </button>
          <button
            class="w-[250px] rounded-md bg-[#5D3BEA] px-6 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            @click="viewPerformance"
          >
            View My Performance
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { handleFileUpload } from '@/utils/extractText'
import { handleDragOver, handleDrop } from '@/utils/dragAndDrop'

const messageContent = ref('')
const quizes = ref([])
const selectedLevel = ref('beginner')
const numQuestions = ref(10)
const loading = ref(false)
const score = ref(null)
const userTimer = ref()
const timer = ref(0)
const showHomeQuizzes = ref(true)
const showGeneratedQuizzes = ref(false)
const showPostSubmission = ref(false)
const currentIndex = ref(0)
const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
const nextQuestion = () => {
  if (currentIndex.value < quizes.value.length - 1) currentIndex.value++
}
const hasError = ref(false)

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
      showHomeQuizzes.value = false
      showGeneratedQuizzes.value = true
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
  showGeneratedQuizzes.value = false
  showPostSubmission.value = true
}

// Highlight correct and incorrect answers
const getAnswerClass = (quiz, option) => {
  if (score.value !== null) {
    const isCorrect = option === quiz.correctAnswer // Correct answer
    const isUserAnswer = option === quiz.userAnswer // User's selected answer
    const isWrong = isUserAnswer && !isCorrect // User selected the wrong answer

    return {
      'bg-[#284E3E] text-[#29DA30] font-bold': isCorrect, // Correct answer
      'bg-[#4E2828] text-[#D44D4D]': isWrong // Wrong answer selected by user
    }
  }
  return {}
}

const retakeQuiz = () => {
  showPostSubmission.value = false
  showHomeQuizzes.value = true
  quizes.value = []
  score.value = null
}

const viewPerformance = () => {
  showPostSubmission.value = false
  showGeneratedQuizzes.value = true
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

// Wrapper for handleDrop to pass the callback
const handleDropWrapper = async event => {
  await handleDrop(event, handleFileUploadWrapper)
}

// Select answer for a question
const selectAnswer = (quiz, option) => {
  if (score.value === null) {
    quiz.userAnswer = option
  }
}
</script>
