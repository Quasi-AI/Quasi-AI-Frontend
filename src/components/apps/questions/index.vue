<template>
  <div class="flex flex-col gap-4">
    <!-- Form Container -->
    <div
      v-if="!showQuestionsContainer"
      class="mx-auto w-full rounded-xl bg-white p-8 shadow-lg dark:bg-[#111C44] dark:text-white"
    >
      <!-- Upload File -->
      <div
        @click="triggerFileInput"
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
          class="h-40 w-full rounded-lg border p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-[#111C44] dark:text-white"
          placeholder="Enter your detailed content here"
        />
      </div>

      <!-- Difficulty & Number of Questions -->
      <div class="mt-4 flex flex-col gap-4 lg:flex-row">
        <div class="w-full">
          <p class="mb-2 block font-medium text-gray-500">Difficulty level</p>
          <select
            v-model="selectedLevel"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-[#111C44] dark:text-white"
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
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-[#111C44] dark:text-white"
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
      v-if="showQuestionsContainer && questions.length > 0"
      class="mt-6 w-full rounded-xl bg-white p-6 shadow-lg dark:bg-[#111C44] dark:text-white"
    >
      <h2 class="mb-4 text-lg font-bold">Generated Questions</h2>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="(item, index) in questions"
          :key="index"
          class="rounded-2xl bg-gray-100 p-4 shadow dark:bg-[#1E2A50] dark:text-white"
        >
          <p>
            <strong>Q{{ index + 1 }}:</strong> {{ item.question }}
          </p>
          <p><strong>Answer:</strong> {{ item.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleFileUpload } from '@/utils/extractText'

const messageContent = ref('')
const questions = ref([])
const selectedLevel = ref('beginner')
const numQuestions = ref(10)
const loading = ref(false)
const showQuestionsContainer = ref(false)

// Generate Questions using API
const generateQuestions = async () => {
  if (!messageContent.value.trim()) {
    questions.value = [
      { question: 'Please provide content to generate questions.', answer: '' }
    ]
    return
  }

  loading.value = true
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
      showQuestionsContainer.value = true
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
</script>
