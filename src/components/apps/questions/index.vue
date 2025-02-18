<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <!-- Input Section -->
    <div class="flex w-full flex-col items-center gap-4 lg:w-[50%]">
      <!-- Text Area -->
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Please ensure your upload is in one of the following formats:</p>
        <div class="mt-2">
          <p>
            <strong>Accepted File Types: (.pdf *, .docx, .mp3, .wav)</strong>
          </p>
        </div>
      </div>

      <!-- File Icons -->
      <div class="mt-2 flex gap-4">
        <!-- Audio Recording Icon -->
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
        @change="handleFileUpload"
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
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="loading"
        @click="generateQuestions"
        variant="blue"
      >
        {{ loading ? 'Generating...' : 'Generate Questions' }}
      </UButton>
    </div>

    <!-- Preview Section -->
    <div class="flex w-full flex-col lg:w-[50%]">
      <h2 class="mb-2 text-lg font-bold">Preview</h2>
      <div v-if="questions.length === 0" class="text-gray-500">
        No questions generated yet.
      </div>
      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="rounded-2xl bg-white p-4 shadow dark:bg-[#111C44] dark:text-white"
        >
          {{ question }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'
import * as pdfjsLib from 'pdfjs-dist'

const messageContent = ref('')
const questions = ref([])
const selectedLevel = ref('beginner') // Default level
const numQuestions = ref(10) // Default number of questions
const loading = ref(false)

// Generate Questions using Google Gemini API
const generateQuestions = async () => {
  if (!messageContent.value.trim()) {
    questions.value = ['Please provide content to generate questions.']
    return
  }

  loading.value = true
  try {
    const response = await fetch(
      useRuntimeConfig().public.GOOGLE_GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Here is some content:\n\n${messageContent.value}\n\nGenerate ${numQuestions.value} ${selectedLevel.value}-level questions based on it.`
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      questions.value = data.candidates[0].content.parts[0].text
        .split('\n')
        .filter(q => q.trim())
    } else {
      questions.value = ['Failed to generate questions.']
    }
  } catch (error) {
    console.error('Error:', error)
    questions.value = ['Error generating questions. Please try again.']
  } finally {
    loading.value = false
  }
}

// Trigger the hidden file input when the button is clicked
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Handle PDF file upload
const handleFileUpload = async event => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    messageContent.value = await extractTextFromPDF(file)
  }
}

// PDF Text Extraction Logic
const extractTextFromPDF = async file => {
  const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise
  let fullText = ''
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const text = await page.getTextContent()
    fullText += text.items.map(item => item.str).join(' ') + '\n'
  }
  return fullText
}
</script>
