<template>
  <div class="flex flex-col gap-4 lg:h-screen">
    <!-- Home -->
    <div v-if="showHomeQuestions" class="w-full">
      <div
        class="flex w-full flex-col items-center justify-end gap-2 p-8 lg:flex-row"
      >
        <UInput
          variant="none"
          class="my-2 w-full rounded-lg border bg-white p-1 lg:w-[200px] dark:border-none dark:bg-[#111C44]"
          placeholder="Search for questions by name"
          v-model="searchQuery"
          maxLength="250"
        />
        <select
          v-model="filterQuestions"
          class="my-2 w-full rounded-lg border bg-white p-2 lg:w-[200px] dark:border-none dark:bg-[#111C44]"
          @change="handleFilterChange"
        >
          <option value="all">All Questions</option>
          <option value="my">My Questions</option>
        </select>
        <button
          @click="HandleCreateQuestionsButton"
          class="flex w-full items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-90 hover:bg-[#4A2DCA] lg:w-[200px]"
          variant="blue"
        >
          Create questions
        </button>
      </div>

      <!-- Questions List -->
      <div v-if="homeQuestions.length > 0" class="mt-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(questionSet, index) in filteredQuestions"
            :key="index"
            class="flex h-full cursor-pointer flex-col justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#1E2A50] dark:text-white"
            @click="openQuestionSet(questionSet)"
          >
            <!-- Message at the top -->
            <p class="text-lg font-semibold">
              {{ truncateText(questionSet.message) }}
            </p>

            <!-- User details always at the bottom -->
            <div class="mt-auto flex items-center gap-3 pt-3">
              <img
                :src="questionSet.created_by.profile"
                alt="Profile"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p class="font-semibold">{{ questionSet.created_by.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(questionSet.created_by.created_at) }}
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

    <!-- Detailed Question Set Container -->
    <div v-if="showQuestionSetDetail && selectedQuestionSet" class="w-full">
      <div class="rounded-lg bg-white p-4 dark:bg-[#111C44] dark:text-white">
        <div
          class="mb-6 flex items-start justify-between gap-4 md:items-center"
        >
          <div
            class="flex flex-col items-start gap-4 md:flex-row md:items-center"
          >
            <img
              :src="selectedQuestionSet.created_by.profile"
              alt="Profile"
              class="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p class="text-lg font-semibold">
                {{ selectedQuestionSet.created_by.name }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDate(selectedQuestionSet.created_by.created_at) }}
              </p>
            </div>
          </div>
          <button
            @click="closeQuestionSetDetail"
            class="flex items-center gap-2 rounded-full bg-[#5D3BEA] px-4 py-1 text-white transition duration-300 hover:bg-[#4A2DCA]"
          >
            <span>Close</span>
          </button>
        </div>

        <p class="mb-6 text-xl font-medium">
          {{ selectedQuestionSet.message }}
        </p>

        <div class="space-y-4">
          <div
            v-for="(question, qIndex) in selectedQuestionSet.questions"
            :key="qIndex"
            class="rounded-lg bg-gray-100 p-4 dark:bg-[#0C1438]"
          >
            <p class="font-medium">{{ question.question }}</p>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {{ question.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div
      v-if="showCreateQuestions"
      class="mx-auto w-full rounded-xl bg-white p-8 shadow-sm dark:bg-[#111C44] dark:text-white"
    >
      <!-- Upload File -->
      <div
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @drop.prevent="handleDropWrapper"
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
            v-model="selectedLevel"
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
            v-model="numQuestions"
            min="1"
            max="20"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
            placeholder="Enter number of questions to generate"
          />
        </div>
      </div>

      <!-- Generate Button -->
      <div class="mt-6 flex justify-center">
        <button
          class="w-full max-w-xs rounded-lg bg-[#5D3BEA] py-3 font-medium text-white transition duration-300 hover:bg-[#4A2DCA] focus:ring-4 focus:ring-indigo-300"
          :disabled="loading"
          @click="generateQuestions"
        >
          {{ loading ? 'Generating...' : 'Generate questions' }}
        </button>
      </div>
    </div>

    <!-- Questions Container (Visible only when questions are generated) -->
    <div
      v-if="showPreviewQuestions && questions.length > 0"
      class="mt-6 w-full rounded-xl p-6"
    >
      <div
        class="mb-6 flex flex-col items-center justify-between gap-4 lg:flex-row"
      >
        <div
          class="flex gap-6 rounded-md bg-white px-4 py-2 text-sm dark:bg-[#1E2A50]"
        >
          <div>
            <p><strong>Topic:</strong> Biology</p>
          </div>
          <div>
            <p><strong>Difficulty Level:</strong> Intermediate</p>
          </div>
          <div>
            <p><strong>No. of questions:</strong> {{ questions.length }}</p>
          </div>
        </div>
        <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
          Share with students
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(item, index) in questions"
          :key="index"
          class="flex flex-col justify-between rounded-lg bg-white p-4 text-center dark:bg-[#1E2A50] dark:text-white"
        >
          <div>
            <div v-if="item.image" class="mb-4">
              <img
                :src="item.image"
                alt="Question"
                class="h-32 w-full rounded-lg object-cover"
              />
            </div>
            <p class="text-wrap text-lg font-semibold">{{ item.question }}</p>
            <p
              v-if="item.answer"
              class="mt-2 text-wrap text-sm text-gray-700 dark:text-gray-300"
            >
              {{ item.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { handleFileUpload } from '@/utils/extractText'
import { handleDragOver, handleDrop } from '@/utils/dragAndDrop'
import EmptyStateIcon from '@/assets/icons/empty-state-icon.vue'
import { truncateText } from '@/utils/truncateText'

const messageContent = ref('')
const questions = ref([])
const homeQuestions = ref([])
const selectedLevel = ref('beginner')
const numQuestions = ref(10)
const loading = ref(false)
const showCreateQuestions = ref(false)
const showPreviewQuestions = ref(false)
const showHomeQuestions = ref(true)
const filterQuestions = ref('all')
const searchQuery = ref('')

// For detailed question set view
const showQuestionSetDetail = ref(false)
const selectedQuestionSet = ref(null)

// Fetch questions on component mount
onMounted(async () => {
  await fetchHomeQuestions()
})

// Fetch questions based on the selected filter
const fetchHomeQuestions = async () => {
  const endpoint =
    filterQuestions.value === 'all'
      ? 'https://dark-caldron-448714-u5.uc.r.appspot.com/question/all'
      : `https://dark-caldron-448714-u5.uc.r.appspot.com/question/${localStorage.getItem(
          'user_id'
        )}`

  try {
    const response = await fetch(endpoint)
    const data = await response.json()
    if (response.ok && data.success) {
      homeQuestions.value = data.Questions
    } else {
      homeQuestions.value = []
    }
  } catch (error) {
    console.error('Error fetching questions:', error)
    homeQuestions.value = []
  }
}

// Handle filter change
const handleFilterChange = () => {
  fetchHomeQuestions()
}

// Filter questions based on search query
const filteredQuestions = computed(() => {
  return homeQuestions.value.filter(question =>
    question.message.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Open detailed view for a question set
const openQuestionSet = questionSet => {
  selectedQuestionSet.value = questionSet
  showQuestionSetDetail.value = true
  showHomeQuestions.value = false
}

// Close detailed view
const closeQuestionSetDetail = () => {
  selectedQuestionSet.value = null
  showQuestionSetDetail.value = false
  showHomeQuestions.value = true
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

// Other functions remain unchanged
const HandleCreateQuestionsButton = async () => {
  showHomeQuestions.value = false
  showCreateQuestions.value = true
  showPreviewQuestions.value = false
}

const generateQuestions = async () => {
  if (!messageContent.value.trim()) {
    questions.value = [
      { question: 'Please provide content to generate questions.', answer: '' }
    ]
    return
  }

  loading.value = true
  showHomeQuestions.value = false
  try {
    const response = await fetch(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/question/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent.value,
          level: selectedLevel.value,
          totalQuestions: numQuestions.value,
          user_id: localStorage.getItem('user_id')
        })
      }
    )

    const data = await response.json()
    if (response.ok && Array.isArray(data.questions)) {
      showHomeQuestions.value = false
      showCreateQuestions.value = false
      showPreviewQuestions.value = true
      questions.value = data.questions
    } else {
      questions.value = [
        { question: 'Failed to generate questions.', answer: '' }
      ]
    }
  } catch (error) {
    console.error('Error:', error)
    questions.value = [
      { question: 'Error generating questions. Please try again.', answer: '' }
    ]
  } finally {
    loading.value = false
  }
}

const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

const updateMessageContent = text => {
  messageContent.value = text
}

const handleFileUploadWrapper = async event => {
  await handleFileUpload(event, updateMessageContent)
}

const handleDropWrapper = async event => {
  await handleDrop(event, handleFileUploadWrapper)
}
</script>
