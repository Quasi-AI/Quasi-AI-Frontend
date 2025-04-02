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
        <div class="flex justify-center">
          <LoaderImage class="w-80" />
        </div>
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
          maxlength="250"
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
        >
          Create flashcards
        </button>
      </div>

      <div v-if="filteredFlashcards?.length > 0" class="mt-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(flashcardSet, index) in filteredFlashcards"
            :key="index"
            class="flex h-full cursor-pointer flex-col justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#1E2A50] dark:text-white"
            @click="openFlashcardSet(flashcardSet)"
          >
            <p class="text-lg font-semibold">
              {{ truncateText(flashcardSet?.message || 'Untitled Flashcard') }}
            </p>
            <div class="mt-auto flex items-center gap-3 pt-3">
              <img
                :src="
                  flashcardSet?.created_by?.profile ||
                  'https://cdn-icons-png.flaticon.com/512/929/929422.png'
                "
                alt="Profile"
                class="h-10 w-10 rounded-full border object-cover dark:border-[#0C1438]"
              />
              <div>
                <p class="font-semibold">
                  {{ flashcardSet?.created_by?.name || 'Unknown' }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(flashcardSet?.created_by?.created_at) }}
                </p>
              </div>
            </div>
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
      <div v-else class="mt-4 text-center text-gray-500">
        No flashcards available.
        <EmptyStateIcon width="100%" height="350px" />
      </div>
    </div>

    <!-- Detailed Flashcard Set Container -->
    <div v-if="showFlashcardSetDetail && selectedFlashcardSet" class="w-full">
      <div class="rounded-lg p-4">
        <div
          class="mb-6 flex items-start justify-between gap-4 md:items-center"
        >
          <button
            @click="closeFlashcardSetDetail"
            class="ml-auto text-gray-500 hover:text-red-500"
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

        <div class="mb-4 flex flex-col-reverse gap-4">
          <div>
            <div
              class="flex w-fit flex-col items-center gap-2 rounded-lg bg-white p-4 shadow-sm lg:flex-row dark:bg-[#111C44]"
            >
              <div class="text-sm font-medium">
                <strong>Topic:</strong>
                <p>
                  {{
                    truncateTextLong(selectedFlashcardSet?.message) ||
                    'No topic specified'
                  }}
                </p>
              </div>
              <div class="text-sm font-medium">
                <strong class="truncate">Difficulty Level:</strong>
                <p>
                  {{
                    (selectedFlashcardSet?.level || 'beginner').toUpperCase()
                  }}
                </p>
              </div>
              <div class="text-sm font-medium">
                <strong class="truncate">No. of Questions:</strong>
                <p>
                  {{ selectedFlashcardSet?.flashcards?.length || 0 }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2">
            <button
              @click="shareWithStudentsModal(selectedFlashcardSet)"
              class="w-[200px] truncate rounded-lg bg-[#5D3BEA] px-4 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            >
              Share with students
            </button>
          </div>
        </div>

        <!-- Flashcards Display -->
        <div class="relative flex h-[60vh] w-full items-center justify-center">
          <div class="relative w-full max-w-md">
            <!-- Background cards for stacking effect -->
            <div
              v-for="n in 3"
              :key="'stack-' + n"
              class="absolute inset-0 h-[300px] w-full transform rounded-lg bg-white shadow-md transition-all duration-300 dark:bg-[#111C44]"
              :style="{
                transform: `translateY(${n * 10}px) rotate(${n * 2}deg)`,
                zIndex: 3 - n
              }"
            ></div>

            <!-- Current Card -->
            <div
              class="relative h-[300px] w-full transform rounded-lg bg-white shadow-lg transition-all duration-500 dark:bg-[#111C44]"
              :style="{ zIndex: 4 }"
            >
              <!-- Question Side -->
              <div class="absolute inset-0 flex flex-col justify-between p-6">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ currentIndex + 1 }}/{{
                      selectedFlashcardSet?.flashcards?.length || 0
                    }}
                  </p>
                  <div class="flex flex-1 items-center justify-center">
                    <h3 class="text-center text-lg font-semibold">
                      {{
                        selectedFlashcardSet?.flashcards?.[currentIndex]
                          ?.front || 'No question available'
                      }}
                    </h3>
                  </div>
                </div>
                <div class="flex justify-between">
                  <button
                    @click="toggleAnswer"
                    class="text-blue-600 hover:underline"
                  >
                    {{ isShowingAnswer ? 'Hide answer' : 'Show answer' }}
                  </button>
                  <button
                    @click="nextCard"
                    class="text-blue-600 hover:underline"
                  >
                    {{ isAtLastCard ? 'Start again' : 'Show next card' }}
                  </button>
                </div>
              </div>

              <!-- Answer Side -->
              <div
                class="absolute inset-0 flex flex-col justify-between rounded-lg bg-white p-6 dark:bg-[#111C44]"
                :class="{ 'opacity-0': !isShowingAnswer }"
              >
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ currentIndex + 1 }}/{{
                      selectedFlashcardSet?.flashcards?.length || 0
                    }}
                  </p>
                  <div class="flex flex-1 items-center justify-center">
                    <p class="text-center text-lg">
                      {{
                        selectedFlashcardSet?.flashcards?.[currentIndex]
                          ?.back || 'No answer provided'
                      }}
                    </p>
                  </div>
                </div>
                <div class="flex justify-between">
                  <button
                    @click="toggleAnswer"
                    class="text-blue-600 hover:underline"
                  >
                    {{ isShowingAnswer ? 'Hide answer' : 'Show answer' }}
                  </button>
                  <button
                    @click="nextCard"
                    class="text-blue-600 hover:underline"
                  >
                    {{ isAtLastCard ? 'Start again' : 'Show next card' }}
                  </button>
                </div>
              </div>
            </div>
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
          accept=".pdf,.docx"
        />
      </div>

      <div class="mt-6">
        <p class="mb-2 block font-medium text-gray-500">Content</p>
        <textarea
          v-model="messageContent"
          class="h-40 w-full rounded-lg border p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          placeholder="Enter your detailed content here"
        />
      </div>

      <div class="mt-4 flex flex-col gap-4 lg:flex-row">
        <div class="w-full">
          <p class="mb-2 block font-medium text-gray-500">
            Subject/Course Title
          </p>
          <input
            type="text"
            v-model="SubjectTitle"
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

      <div class="mt-6 flex justify-center">
        <button
          class="w-full max-w-xs rounded-lg bg-[#5D3BEA] py-3 font-medium text-white transition duration-300 hover:bg-[#4A2DCA] focus:ring-4 focus:ring-indigo-300"
          :disabled="
            isLoading || !messageContent || !SubjectTitle || !totalQuestions
          "
          @click="generateFlashcards"
        >
          {{ isLoading ? 'Generating...' : 'Generate Flashcards' }}
        </button>
      </div>

      <div v-if="errorMessage" class="mt-4 text-center text-red-500">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Preview Flashcards Container -->
    <div v-if="showPreviewFlashcards" class="w-full rounded-lg p-4">
      <div class="mb-6 flex items-start justify-between gap-4 md:items-center">
        <button
          @click="closeFlashcardSetDetail"
          class="ml-auto text-gray-500 hover:text-red-500"
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
      <div class="mb-4 flex flex-col-reverse gap-4">
        <div>
          <div
            class="flex w-fit flex-col items-center gap-2 rounded-lg bg-white p-4 shadow-sm lg:flex-row dark:bg-[#111C44]"
          >
            <div class="text-sm font-medium">
              <strong>Topic:</strong>
              <p>
                {{ truncateTextLong(messageContent) || 'No topic specified' }}
              </p>
            </div>
            <div class="text-sm font-medium">
              <strong class="truncate">Difficulty Level:</strong>
              <p>
                {{ (level || 'beginner').toUpperCase() }}
              </p>
            </div>
            <div class="text-sm font-medium">
              <strong class="truncate">No. of Questions:</strong>
              <p>
                {{ flashcards?.length || 0 }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2">
          <button
            @click="shareWithStudentsModal(flashcards)"
            class="w-[200px] truncate rounded-lg bg-[#5D3BEA] px-4 py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
          >
            Share with students
          </button>
        </div>
      </div>

      <div
        v-if="flashcards.length > 0"
        class="relative flex h-[60vh] w-full items-center justify-center"
      >
        <div class="relative w-full max-w-md">
          <!-- Background cards for stacking effect -->
          <div
            v-for="n in 3"
            :key="'stack-' + n"
            class="absolute inset-0 h-[300px] w-full transform rounded-lg bg-white shadow-md transition-all duration-300 dark:bg-[#111C44]"
            :style="{
              transform: `translateY(${n * 10}px) rotate(${n * 2}deg)`,
              zIndex: 3 - n
            }"
          ></div>

          <!-- Current Card -->
          <div
            class="relative h-[300px] w-full transform rounded-lg bg-white shadow-lg transition-all duration-500 dark:bg-[#111C44]"
            :style="{ zIndex: 4 }"
          >
            <!-- Question Side -->
            <div class="absolute inset-0 flex flex-col justify-between p-6">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ currentIndex + 1 }}/{{ flashcards.length || 0 }}
                </p>
                <div class="flex flex-1 items-center justify-center">
                  <h3 class="text-center text-lg font-semibold">
                    {{
                      flashcards[currentIndex]?.front || 'No question available'
                    }}
                  </h3>
                </div>
              </div>
              <div class="flex justify-between">
                <button
                  @click="toggleAnswer"
                  class="text-blue-600 hover:underline"
                >
                  {{ isShowingAnswer ? 'Hide answer' : 'Show answer' }}
                </button>
                <button @click="nextCard" class="text-blue-600 hover:underline">
                  {{ isAtLastCard ? 'Start again' : 'Show next card' }}
                </button>
              </div>
            </div>

            <!-- Answer Side -->
            <div
              class="absolute inset-0 flex flex-col justify-between rounded-lg bg-white p-6 dark:bg-[#111C44]"
              :class="{ 'opacity-0': !isShowingAnswer }"
            >
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ currentIndex + 1 }}/{{ flashcards.length || 0 }}
                </p>
                <div class="flex flex-1 items-center justify-center">
                  <p class="text-center text-lg">
                    {{ flashcards[currentIndex]?.back || 'No answer provided' }}
                  </p>
                </div>
              </div>
              <div class="flex justify-between">
                <button
                  @click="toggleAnswer"
                  class="text-blue-600 hover:underline"
                >
                  {{ isShowingAnswer ? 'Hide answer' : 'Show answer' }}
                </button>
                <button @click="nextCard" class="text-blue-600 hover:underline">
                  {{ isAtLastCard ? 'Start again' : 'Show next card' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { handleFileUpload } from '@/utils/extractText'
import { handleDragOver, handleDrop } from '@/utils/dragAndDrop'
import EmptyStateIcon from '@/assets/icons/empty-state-icon.vue'
import LoaderImage from '@/assets/icons/loader-image.vue'

// State management
const messageContent = ref('')
const selectedPublicity = ref('private')
const SubjectTitle = ref('')
const flashcards = ref([])
const homeFlashcards = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const level = ref('beginner')
const totalQuestions = ref(10)
const isShowingAnswer = ref(false)
const currentIndex = ref(0)
const showCreateFlashcards = ref(false)
const showPreviewFlashcards = ref(false)
const showHomeFlashcards = ref(true)
const filterFlashcards = ref('all')
const searchQuery = ref('')
const showFlashcardSetDetail = ref(false)
const selectedFlashcardSet = ref(null)
const isShareWithStudentModalVisible = ref(false)

// Computed properties
const isAtLastCard = computed(() => {
  const flashcardsArray =
    selectedFlashcardSet.value?.flashcards || flashcards.value
  return currentIndex.value === (flashcardsArray?.length || 0) - 1
})

// Utility functions
const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const truncateTextLong = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = dateString => {
  if (!dateString) return 'Unknown date'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}

// Component functions
const toggleAnswer = () => {
  isShowingAnswer.value = !isShowingAnswer.value
}

const nextCard = () => {
  const flashcardsArray =
    selectedFlashcardSet.value?.flashcards || flashcards.value
  const totalCards = flashcardsArray?.length || 0

  if (currentIndex.value < totalCards - 1) {
    currentIndex.value++
  } else {
    // Reset to first card if at the end
    currentIndex.value = 0
  }
  isShowingAnswer.value = false
}

const HandleCreateFlashcardsButton = () => {
  showHomeFlashcards.value = false
  showCreateFlashcards.value = true
  showPreviewFlashcards.value = false
  errorMessage.value = ''
}

const openFlashcardSet = flashcardSet => {
  if (!flashcardSet) return

  selectedFlashcardSet.value = flashcardSet
  showFlashcardSetDetail.value = true
  showHomeFlashcards.value = false
  currentIndex.value = 0
  isShowingAnswer.value = false
}

const closeFlashcardSetDetail = () => {
  selectedFlashcardSet.value = null
  showFlashcardSetDetail.value = false
  showHomeFlashcards.value = true
  showCreateFlashcards.value = false
  showPreviewFlashcards.value = false
  currentIndex.value = 0
  isShowingAnswer.value = false
  errorMessage.value = ''
}

// Data fetching
const fetchHomeFlashcards = async () => {
  try {
    const endpoint =
      filterFlashcards.value === 'all'
        ? 'https://dark-caldron-448714-u5.uc.r.appspot.com/flashcard/all'
        : `https://dark-caldron-448714-u5.uc.r.appspot.com/flashcard/${sessionStorage.getItem('user_id')}`

    const response = await axios.get(endpoint)
    homeFlashcards.value = response.data?.success
      ? response.data.flashcards
      : []
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    errorMessage.value = 'Failed to load flashcards'
    homeFlashcards.value = []
  } finally {
    isLoading.value = false
  }
}

const handleFilterChange = () => {
  fetchHomeFlashcards()
}

const filteredFlashcards = computed(() => {
  if (!homeFlashcards.value) return []
  return homeFlashcards.value.filter(flashcard => {
    const titleMatch = flashcard.title
      ?.toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const messageMatch = flashcard.message
      ?.toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    return titleMatch || messageMatch
  })
})

// Flashcard generation
const generateFlashcards = async () => {
  if (!messageContent.value || !SubjectTitle.value || !totalQuestions.value) {
    errorMessage.value = 'Please fill all required fields'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

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
      flashcards.value = response.data?.flashcards || []
      currentIndex.value = 0
      isShowingAnswer.value = false
      showPreviewFlashcards.value = true
      showHomeFlashcards.value = false
      showCreateFlashcards.value = false
    } else {
      errorMessage.value =
        response.data?.error || 'Failed to generate flashcards'
    }
  } catch (err) {
    console.error('Error generating flashcards:', err)
    errorMessage.value =
      err.response?.data?.message ||
      err.message ||
      'Failed to generate flashcards'
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

// Share functionality
const shareWithStudentsModal = flashcardSet => {
  if (!flashcardSet) return
  selectedFlashcardSet.value = flashcardSet
  isShareWithStudentModalVisible.value = true
}

const closeShareWithStudents = () => {
  isShareWithStudentModalVisible.value = false
}

const handleShare = selectedStudents => {
  console.log('Selected Students:', selectedStudents)
  closeShareWithStudents()
}

// Lifecycle hooks
onMounted(async () => {
  await fetchHomeFlashcards()
})
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

/* Transition effects for answer display */
.answer-enter-active,
.answer-leave-active {
  transition: opacity 0.3s ease;
}
.answer-enter-from,
.answer-leave-to {
  opacity: 0;
}
</style>
