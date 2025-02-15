<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <div class="flex w-full flex-col items-center gap-4 lg:w-[50%]">
      <!-- Text Area -->
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload (Styled as Text Link) -->
      <label
        for="file-upload"
        class="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
      >
        Upload PDF File
      </label>
      <input
        id="file-upload"
        type="file"
        @change="handleFileUpload"
        class="hidden"
      />

      <!-- File Upload (Styled as Icon Button) -->
      <UButton
        icon="i-heroicons-document-arrow-up"
        class="rounded-full bg-gray-200 p-2 dark:bg-gray-700"
        @click="triggerFileInput"
      />

      <UButton
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="loading"
        @click="generateQuestions"
        variant="blue"
      >
        {{ loading ? 'Generating...' : 'Generate Questions' }}
      </UButton>
    </div>

    <!-- Preview Area -->
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
const messageContent = ref('')
const questions = ref([])
const loading = ref(false)

// Trigger hidden file input
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Generate Questions
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
                  text: `Here is some content:\n\n${messageContent.value}\n\nGenerate 11 insightful questions based on it.`
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

// Handle PDF file upload
const handleFileUpload = async event => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    messageContent.value = await extractTextFromPDF(file)
  }
}

// PDF Text Extraction Logic
const extractTextFromPDF = async file => {
  const pdf = await PDFJS.getDocument(URL.createObjectURL(file)).promise
  let fullText = ''
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const text = await page.getTextContent()
    fullText += text.items.map(item => item.str).join(' ') + '\n'
  }
  return fullText
}
</script>
