<template>
  <div class="flex flex-col gap-4">
    <!-- Form Container -->
    <div
      v-if="!showQuestionsContainer"
      class="flex w-full flex-col items-center gap-4"
    >
      <!-- Text Area -->
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type or upload a file to generate questions..."
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Please ensure your upload is in one of the following formats:</p>
        <div class="mt-2">
          <p><strong>Accepted File Types: (.pdf, .docx)</strong></p>
        </div>
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

      <!-- Generate Button -->
      <UButton
        class="flex w-[200px] items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        variant="blue"
        :disabled="loading"
        @click="generateQuestions"
      >
        {{ loading ? 'Generating...' : 'Generate Questions' }}
      </UButton>
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
import { ref } from 'vue'
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
</script>
