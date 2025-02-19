<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <!-- Input Section -->
    <div class="flex w-full flex-col items-center gap-4 lg:w-[50%]">
      <!-- Text Area -->
      <textarea
        v-model="inputText"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Paste your content here to check for plagiarism"
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Please ensure your upload is in one of the following formats:</p>
        <div class="mt-2">
          <p>
            <strong>Accepted File Types: (.pdf *, .docx)</strong>
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

      <!-- Check Plagiarism Button -->
      <UButton
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="loading"
        @click="checkPlagiarism"
        variant="blue"
      >
        {{ loading ? 'Checking...' : 'Check Plagiarism' }}
      </UButton>
    </div>

    <!-- Results Section -->
    <div class="flex w-full flex-col lg:w-[50%]">
      <h2 class="mb-2 text-lg font-bold">Plagiarism Check Results</h2>
      <div v-if="results.length === 0" class="text-gray-500">
        No plagiarism results yet.
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="rounded-2xl bg-white p-4 shadow dark:bg-[#111C44] dark:text-white"
        >
          <p><strong>Match:</strong> {{ result.match }}</p>
          <p><strong>Source:</strong> {{ result.source }}</p>
          <p><strong>Similarity:</strong> {{ result.similarity }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as pdfjsLib from 'pdfjs-dist'

const inputText = ref('')
const results = ref([])
const loading = ref(false)

// Check Plagiarism using an external API
const checkPlagiarism = async () => {
  if (!inputText.value.trim()) {
    results.value = [
      {
        match: 'Please provide content to check for plagiarism.',
        source: '',
        similarity: 0
      }
    ]
    return
  }

  loading.value = true
  try {
    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/flashcards/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.value
        })
      }
    )

    const data = await response.json()
    if (data?.matches) {
      results.value = data.matches
    } else {
      results.value = [
        { match: 'No plagiarism detected.', source: '', similarity: 0 }
      ]
    }
  } catch (error) {
    console.error('Error:', error)
    results.value = [
      {
        match: 'Error checking for plagiarism. Please try again.',
        source: '',
        similarity: 0
      }
    ]
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
    inputText.value = await extractTextFromPDF(file)
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
