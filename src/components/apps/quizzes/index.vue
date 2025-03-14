<template>
  <div class="flex flex-col gap-4 lg:h-screen">
    <!-- Loader Modal -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="relative w-[600px] rounded-lg bg-white p-8 text-center shadow-lg"
      >
        <h2 class="mb-4 text-2xl font-semibold text-gray-900">
          Hang on a sec...
        </h2>

        <!-- Illustration -->
        <div class="flex justify-center">
          <LoaderImage class="w-80" />
        </div>

        <!-- Loader Bar -->
        <div class="relative mt-4 h-3 w-full max-w-md rounded-full bg-gray-200">
          <div
            class="absolute left-0 h-3 w-1/2 animate-pulse rounded-full bg-orange-500"
          ></div>
        </div>

        <p class="mt-3 text-gray-600">Loading...</p>
      </div>
    </div>

    <!-- Home -->
    <div v-if="showHomeQuizzes" class="w-full">
      <div
        class="flex w-full flex-col items-center justify-end gap-2 p-8 lg:flex-row"
      >
        <UInput
          variant="none"
          class="my-2 w-full rounded-lg border bg-white p-1 lg:w-[200px] dark:border-none dark:bg-[#111C44]"
          placeholder="Search for quizzes by name"
          v-model="searchQuery"
          maxLength="250"
        />
        <select
          v-model="filterQuizes"
          class="my-2 w-full rounded-lg border bg-white p-2 lg:w-[200px] dark:border-none dark:bg-[#111C44]"
          @change="fetchQuizzes"
        >
          <option value="all">All Quizzes</option>
          <option value="my">My Quizzes</option>
        </select>
        <button
          @click="HandleCreateQuizzesButton"
          class="flex w-full items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-90 hover:bg-[#4A2DCA] lg:w-[200px]"
          variant="blue"
        >
          Create quizzes
        </button>
      </div>

      <!-- Questions List -->
      <div v-if="quizzes.length > 0" class="mt-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="quiz in filteredQuizzes"
            :key="quiz.title"
            class="flex h-full cursor-pointer flex-col justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#1E2A50] dark:text-white"
            @click="openQuiz(quiz)"
          >
            <!-- Message at the top -->
            <p class="text-lg font-semibold">
              {{ quiz.title }}
            </p>

            <!-- User details always at the bottom -->
            <div class="mt-auto flex items-center gap-3 pt-3">
              <img
                :src="quiz.created_by.profile"
                alt="Profile"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p class="font-semibold">{{ quiz.created_by.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(quiz.created_by.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State (Show when no questions are available) -->
      <div v-else class="mt-4 text-center text-gray-500">
        No questions available.
        <EmptyStateIcon width="100%" height="350px" />
      </div>
    </div>

    <!-- Quiz Detail View -->
    <div v-if="showQuizDetail" class="w-full">
      <div class="p-4">
        <div class="rounded-lg bg-white p-4 dark:bg-[#111C44] dark:text-white">
          <div
            class="mb-6 flex flex-wrap items-start justify-between gap-4 md:items-center"
          >
            <div
              class="flex flex-col items-start gap-4 md:flex-row md:items-center"
            >
              <img
                :src="selectedQuiz.created_by.profile"
                alt="Profile"
                class="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p class="text-lg font-semibold">
                  {{ selectedQuiz.created_by.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(selectedQuiz.created_by.created_at) }}
                </p>
              </div>
            </div>
            <button
              @click="closeQuizzesSetDetail"
              class="flex items-center gap-2 rounded-full bg-[#5D3BEA] px-4 py-1 text-white transition duration-300 hover:bg-[#4A2DCA]"
            >
              <span>Close</span>
            </button>
          </div>

          <p class="mb-6 text-xl font-medium">
            {{ selectedQuiz.message }}
          </p>

          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              v-for="(question, index) in selectedQuiz.quizes"
              :key="index"
              class="rounded-lg border p-4 dark:border-[#0C1438]"
            >
              <p class="font-medium">{{ question.question }}</p>

              <img
                v-if="question.image"
                :src="question.image"
                alt="Question"
                class="mt-2 max-h-48 w-full rounded-lg object-cover"
              />

              <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                <p
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  class="rounded-lg border p-2 dark:border-[#0C1438]"
                >
                  {{ option }}
                </p>
              </div>

              <p class="mt-2 text-sm text-gray-500">
                Correct Answer: {{ question.correctAnswer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div
      v-if="showCreateQuizzes"
      class="mx-auto w-full rounded-xl bg-white p-8 shadow-sm dark:bg-[#111C44] dark:text-white"
    >
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

      <!-- Text Area for Content -->
      <div class="mb-6">
        <p class="mb-2 block font-medium text-gray-500">Quiz Content</p>
        <textarea
          v-model="messageContent"
          class="h-40 w-full rounded-lg border p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          placeholder="Type your content here"
        />
      </div>

      <!-- Quiz Settings -->
      <div class="flex flex-col gap-4">
        <div class="w-full">
          <p class="mb-2 block font-medium text-gray-500">
            Subject/Course Title
          </p>
          <input
            type="text"
            v-model="SubjectTitle"
            min="1"
            max="50"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
            placeholder="Enter Subject/Course Title"
          />
        </div>

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
          <p class="mb-2 block font-medium text-gray-500">Private or Public</p>
          <select
            v-model="selectedPublicity"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
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
          :disabled="isLoading"
          @click="generateQuestions"
        >
          {{ isLoading ? 'Generating...' : 'Generate quizzes' }}
        </button>
      </div>
    </div>

    <!-- Quiz Section -->
    <div v-if="showPreviewQuizzes" class="flex w-full flex-col text-center">
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
import { handleFileUpload } from '@/utils/extractText'
import { handleDragOver, handleDrop } from '@/utils/dragAndDrop'
import EmptyStateIcon from '@/assets/icons/empty-state-icon.vue'
import LoaderImage from '@/assets/icons/loader-image.vue'

const SubjectTitle = ref('')
const selectedPublicity = ref('private')
const messageContent = ref('')
const quizes = ref([])
const selectedLevel = ref('beginner')
const numQuestions = ref(10)
const isLoading = ref(false)
const score = ref(null)
const userTimer = ref()
const timer = ref(0)
const showCreateQuizzes = ref(false)
const showPreviewQuizzes = ref(false)
const showHomeQuizzes = ref(true)
const showGeneratedQuizzes = ref(false)
const showPostSubmission = ref(false)
const showQuizDetail = ref(false)
const currentIndex = ref(0)
const quizzes = ref([])
const selectedQuiz = ref(null)
const searchQuery = ref('')
const filterQuizes = ref('all')
const hasError = ref(false)
let timerInterval

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
const nextQuestion = () => {
  if (currentIndex.value < quizes.value.length - 1) currentIndex.value++
}

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

// Fetch quizzes on component mount
onMounted(() => {
  fetchQuizzes()
})

// Fetch quizzes based on filter
const fetchQuizzes = async () => {
  try {
    const endpoint =
      filterQuizes.value === 'my'
        ? `/quiz/${localStorage.getItem('user_id')}`
        : '/quiz/all'
    const response = await fetch(
      `https://dark-caldron-448714-u5.uc.r.appspot.com${endpoint}`
    )
    if (!response.ok) throw new Error('Failed to fetch quizzes')
    const data = await response.json()
    quizzes.value = data.Quizes
  } catch (error) {
    console.error('Error fetching quizzes:', error)
  }
}

// Filter quizzes based on search query
const filteredQuizzes = computed(() => {
  return quizzes.value.filter(quiz =>
    quiz.message.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Open quiz detail view
const openQuiz = quiz => {
  selectedQuiz.value = quiz
  showQuizDetail.value = true
  showHomeQuizzes.value = false
}

// Close detailed view
const closeQuizzesSetDetail = () => {
  selectedQuiz.value = null
  showQuizDetail.value = false
  showHomeQuizzes.value = true
}

// Format date
const formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Handle create flashcards button
const HandleCreateQuizzesButton = async () => {
  showHomeQuizzes.value = false
  showCreateQuizzes.value = true
  showPreviewQuizzes.value = false
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

  isLoading.value = true
  showHomeQuizzes.value = false
  try {
    const response = await fetch(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/quizes/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: SubjectTitle.value,
          message: messageContent.value,
          visible: selectedPublicity.value,
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
      showPreviewQuizzes.value = true
      showHomeQuizzes.value = false
      showCreateQuizzes.value = false
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
    isLoading.value = false
  }
}

// Check user answers
const checkAnswers = async () => {
  // Make function async
  let correctCount = 0
  quizes.value.forEach(quiz => {
    if (quiz.userAnswer === quiz.correctAnswer) correctCount++
  })

  score.value = correctCount
  clearInterval(timerInterval) // Stop timer
  showGeneratedQuizzes.value = false
  showPreviewQuizzes.value = false
  showPostSubmission.value = true

  try {
    const response = await fetch(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/add-students-report',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: localStorage.getItem('name'),
          email: localStorage.getItem('email'),
          user_id: localStorage.getItem('user_id'),
          profile_image: '',
          practice_type: 'Quiz',
          score: score.value
        })
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json() // Process response
    console.log('Quiz submitted successfully:', data)
  } catch (error) {
    console.error('Error submitting quiz:', error)
  }
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
  showPreviewQuizzes.value = true
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

<style scoped>
@keyframes pulse {
  0% {
    width: 10%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 10%;
  }
}

.animate-pulse {
  animation: pulse 2s infinite ease-in-out;
}
</style>
