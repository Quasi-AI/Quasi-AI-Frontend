<template>
  <div class="flex flex-col gap-4 lg:h-screen">
    <!-- Share with Students Modal -->
    <ShareWith
      v-if="isShareWithStudentModalVisible"
      :isVisible="isShareWithStudentModalVisible"
      @close="closeShareWithStudents"
      @share="handleShare"
      type="flashcard"
      :assignmentId="selectedFlashcardSet?.id || ''"
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
    <div v-if="showHomeFlashcards" class="w-full">
      <div
        class="flex w-full flex-col items-center justify-end gap-2 py-8 lg:flex-row"
      >
        <UInput
          variant="none"
          class="my-2 w-full rounded-lg border bg-white p-1 lg:w-[200px] dark:border-none dark:bg-[#111C44]"
          placeholder="Search for flashcards by name"
          v-model="searchQuery"
          maxLength="250"
        />
        <select
          v-model="filterFlashcards"
          class="my-2 w-full rounded-lg border bg-white p-2 lg:w-[200px] dark:border-none dark:bg-[#111C44]"
          @change="handleFilterChange"
        >
          <option value="all">All Flashcards</option>
          <option value="my">My Flashcards</option>
        </select>
        <button
          @click="HandleCreateFlashcardsButton"
          class="flex w-full items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-90 hover:bg-[#4A2DCA] lg:w-[200px]"
          variant="blue"
        >
          Create flashcards
        </button>
      </div>

      <!-- Flashcards List -->
      <div v-if="homeFlashcards?.length > 0" class="mt-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(flashcardSet, index) in filteredFlashcards"
            :key="index"
            class="flex h-full cursor-pointer flex-col justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#1E2A50] dark:text-white"
            @click="openFlashcardSet(flashcardSet)"
          >
            <!-- Message at the top -->
            <p class="text-lg font-semibold">
              {{ truncateText(flashcardSet.message) }}
            </p>

            <!-- User details always at the bottom -->
            <div class="mt-auto flex items-center gap-3 pt-3">
              <img
                :src="
                  flashcardSet.created_by.profile ||
                  'https://cdn-icons-png.flaticon.com/512/929/929422.png'
                "
                alt="Profile"
                class="h-10 w-10 rounded-full border object-cover dark:border-[#0C1438]"
              />
              <div>
                <p class="font-semibold">{{ flashcardSet.created_by.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(flashcardSet.created_by.created_at) }}
                </p>
              </div>
            </div>

            <!-- Share Icon -->
            <div class="mt-4 flex items-center justify-end gap-2">
              <button
                @click.stop="shareWithStudentsModal(flashcardSet)"
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

      <!-- Empty State (Show when no flashcards are available) -->
      <div v-else class="mt-4 text-center text-gray-500">
        No flashcards available.
        <EmptyStateIcon width="100%" height="350px" />
      </div>
    </div>

    <!-- Detailed Flashcard Set Container -->
    <div v-if="showFlashcardSetDetail && selectedFlashcardSet" class="w-full">
      <div class="rounded-lg bg-white p-4 dark:bg-[#111C44] dark:text-white">
        <div
          class="mb-6 flex items-start justify-between gap-4 md:items-center"
        >
          <div
            class="flex flex-col items-start gap-4 md:flex-row md:items-center"
          >
            <img
              :src="selectedFlashcardSet.created_by.profile"
              alt="Profile"
              class="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p class="text-lg font-semibold">
                {{ selectedFlashcardSet.created_by.name }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDate(selectedFlashcardSet.created_by.created_at) }}
              </p>
            </div>
          </div>
          <button
            @click="closeFlashcardSetDetail"
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
          {{ selectedFlashcardSet.title }}
        </p>
        <p class="mb-6 text-sm font-medium">
          {{ selectedFlashcardSet.message }}
        </p>

        <!-- Flashcards Carousel -->
        <div class="w-full">
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
                  {{ selectedFlashcardSet?.flashcards?.[currentIndex]?.front }}
                </h3>
              </div>

              <!-- Back (Answer) -->
              <div
                class="backface-hidden rotate-y-180 absolute inset-0 flex h-full w-full items-center justify-center rounded-lg bg-green-600 p-5 text-white transition-transform"
                :class="{ hidden: !isFlipped, block: isFlipped }"
              >
                <p class="text-lg">
                  {{ selectedFlashcardSet?.flashcards?.[currentIndex]?.back }}
                </p>
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
              :disabled="
                currentIndex === selectedFlashcardSet?.flashcards?.length - 1
              "
            >
              Next
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div
      v-if="showCreateFlashcards"
      class="mx-auto w-full rounded-xl bg-white p-8 shadow-sm dark:bg-[#111C44] dark:text-white"
    >
      <div class="flex justify-end pb-4">
        <button
          @click="closeFlashcardSetDetail"
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
          <p class="mb-2 block font-medium text-gray-500">Private or Public</p>
          <select
            v-model="selectedPublicity"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
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

      <div class="mt-4 flex items-center justify-between">
        <p class="pb-4 text-lg font-semibold">
          {{ truncateTextLong(messageContent) }}
        </p>
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
import { handleDragOver, handleDrop } from '@/utils/dragAndDrop'
import EmptyStateIcon from '@/assets/icons/empty-state-icon.vue'
import { truncateText, truncateTextLong } from '@/utils/truncateText'
import LoaderImage from '@/assets/icons/loader-image.vue'

const messageContent = ref('')
const selectedPublicity = ref('private')
const SubjectTitle = ref('')
const flashcards = ref([])
const homeFlashcards = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const level = ref('beginner')
const totalQuestions = ref('')
const isFlipped = ref(false)
const currentIndex = ref(0)
const showCreateFlashcards = ref(false)
const showPreviewFlashcards = ref(false)
const showHomeFlashcards = ref(true)
const filterFlashcards = ref('all')
const searchQuery = ref('')

// For detailed flashcard set view
const showFlashcardSetDetail = ref(false)
const selectedFlashcardSet = ref(null)

// Fetch flashcards on component mount
onMounted(async () => {
  await fetchHomeFlashcards()
})

// Fetch flashcards based on the selected filter
const fetchHomeFlashcards = async () => {
  const endpoint =
    filterFlashcards.value === 'all'
      ? 'https://dark-caldron-448714-u5.uc.r.appspot.com/flashcard/all'
      : `https://dark-caldron-448714-u5.uc.r.appspot.com/flashcard/${localStorage.getItem(
          'user_id'
        )}`

  try {
    const response = await axios.get(endpoint)
    if (response.data.success) {
      homeFlashcards.value = response.data.flashcards
    } else {
      homeFlashcards.value = []
    }
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    homeFlashcards.value = []
  }
}

// Handle filter change
const handleFilterChange = () => {
  fetchHomeFlashcards()
}

// Filter flashcards based on search query
const filteredFlashcards = computed(() => {
  return homeFlashcards.value.filter(flashcard =>
    flashcard.message.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Open detailed view for a flashcard set
const openFlashcardSet = flashcardSet => {
  selectedFlashcardSet.value = flashcardSet
  showFlashcardSetDetail.value = true
  showHomeFlashcards.value = false
}

// Close detailed view
const closeFlashcardSetDetail = () => {
  selectedFlashcardSet.value = null
  showFlashcardSetDetail.value = false
  showHomeFlashcards.value = true
  showCreateFlashcards.value = false
  showPreviewFlashcards.value = false
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
  const flashcardsArray =
    selectedFlashcardSet.value?.flashcards || flashcards.value
  if (currentIndex.value < flashcardsArray.length - 1) {
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
      title: SubjectTitle.value,
      visible: selectedPublicity.value,
      user_id: sessionStorage.getItem('user_id'),
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
      currentIndex.value = 0 // Reset currentIndex
      isFlipped.value = false // Reset isFlipped
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

// Wrapper for handleDrop to pass the callback
const handleDropWrapper = async event => {
  await handleDrop(event, handleFileUploadWrapper)
}

// share with students
const isShareWithStudentModalVisible = ref(false)

const shareWithStudentsModal = flashcardSet => {
  selectedFlashcardSet.value = flashcardSet
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
