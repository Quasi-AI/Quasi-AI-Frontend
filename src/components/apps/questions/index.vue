<template>
  <div class="flex flex-col gap-4 lg:h-screen">
    <!-- Share with Students Modal -->
    <ShareWith
      v-if="isShareWithStudentModalVisible"
      :isVisible="isShareWithStudentModalVisible"
      @close="closeShareWithStudents"
      @share="handleShare"
      type="question"
      :assignmentId="selectedQuestionSet?.id || ''"
    />

    <!-- Loader Modal -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="relative w-[600px] rounded-lg bg-white p-8 text-center shadow-lg dark:bg-[#111C44]"
      >
        <h2 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Hang on a sec...
        </h2>

        <!-- Illustration -->
        <div class="flex justify-center">
          <LoaderImage class="w-80" />
        </div>

        <!-- Loader Bar -->
        <div
          class="relative mt-4 h-3 w-full max-w-md rounded-full bg-white dark:bg-[#111C44]"
        >
          <div
            class="absolute left-0 h-3 w-1/2 animate-pulse rounded-full bg-orange-500"
          ></div>
        </div>

        <p class="mt-3 text-gray-600">Loading...</p>
      </div>
    </div>

    <!-- Home -->
    <div v-if="showHomeQuestions" class="w-full">
      <div
        class="flex w-full flex-col items-center justify-end gap-2 py-8 lg:flex-row"
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
            <!-- Share Icon -->
            <div class="mt-4 flex items-center justify-end gap-2">
              <button
                @click.stop="shareWithStudentsModal(questionSet)"
                class="text-gray-500 hover:text-[#5D3BEA]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
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
          class="mb-6 flex flex-wrap items-start justify-between gap-4 md:items-center"
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
            class="mr-4 text-gray-500 hover:text-red-500"
            title="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p class="mb-2 text-xl font-bold">
          {{ selectedQuestionSet.title }}
        </p>
        <p class="mb-6 text-sm font-medium">
          {{ selectedQuestionSet.message }}
        </p>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            v-for="(question, qIndex) in selectedQuestionSet.questions"
            :key="qIndex"
            class="rounded-lg border bg-gray-100 p-4 dark:border-[#0A122E] dark:bg-[#0C1438]"
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
      <div class="flex justify-end pb-4">
        <button
          @click="closeQuestionSetDetail"
          class="text-gray-500 hover:text-red-500"
          title="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

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

        <div class="w-full">
          <p class="mb-2 block font-medium text-gray-500">Public or Private</p>
          <select
            v-model="selectedPublicity"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

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
          <p class="mb-2 block font-medium text-gray-500">Difficulty level</p>
          <select
            v-model="selectedQuestionType"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          >
            <option value="multiple choice">Multiple Choice</option>
            <option value="Theory">Theory</option>
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
          :disabled="isLoading"
          @click="generateQuestions"
        >
          {{ isLoading ? 'Generating...' : 'Generate questions' }}
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
import LoaderImage from '@/assets/icons/loader-image.vue'
import { truncateText } from '@/utils/truncateText'

const SubjectTitle = ref('')
const messageContent = ref('')
const questions = ref([])
const homeQuestions = ref([])
const selectedLevel = ref('beginner')
const selectedPublicity = ref('private')
const selectedQuestionType = ref('Theory')
const numQuestions = ref(10)
const isLoading = ref(false)
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
      : `https://dark-caldron-448714-u5.uc.r.appspot.com/question/${sessionStorage.getItem(
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
  showCreateQuestions.value = false
  showPreviewQuestions.value = false
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

  isLoading.value = true
  showHomeQuestions.value = false
  try {
    const response = await fetch(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/question/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: SubjectTitle.value,
          question_type: selectedQuestionType.value,
          message: messageContent.value,
          visible: selectedPublicity.value,
          level: selectedLevel.value,
          totalQuestions: numQuestions.value,
          user_id: sessionStorage.getItem('user_id')
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
    isLoading.value = false
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

// share with students
const isShareWithStudentModalVisible = ref(false)

const shareWithStudentsModal = questionSet => {
  selectedQuestionSet.value = questionSet
  isShareWithStudentModalVisible.value = true
}

const closeShareWithStudents = () => {
  isShareWithStudentModalVisible.value = false
}

const handleShare = selectedStudents => {
  console.log('Selected Students:', selectedStudents)
  // Perform sharing logic here
  closeShareWithStudents()
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
