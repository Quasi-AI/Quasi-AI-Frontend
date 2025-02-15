<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <div class="flex w-full flex-col items-center gap-4 lg:w-[50%]">
      <!-- Text Area -->
      <UTextarea
        v-model="messageContent"
        variant="none"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload (Styled as Text Link) -->
      <label for="file-upload" class="cursor-pointer text-blue-600 hover:underline dark:text-blue-400">
        Upload PDF for Flashcards
      </label>
      <input id="file-upload" type="file" @change="handleFileUpload" class="hidden" />

      <!-- File Upload (Styled as Icon Button) -->
      <UButton icon="i-heroicons-document-arrow-up" class="rounded-full bg-gray-200 p-2 dark:bg-gray-700" @click="triggerFileInput" />

      <UButton
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="loading"
        @click="generateFlashcards"
        variant="blue"
      >
        {{ loading ? 'Generating...' : 'Generate Flashcards' }}
      </UButton>
    </div>

    <!-- Flashcards Preview -->
    <div class="flex w-full flex-col lg:w-[50%]">
      <h2 class="mb-2 text-lg font-bold">Preview</h2>
      <div v-if="flashcards.length === 0" class="text-gray-500">
        No flashcards generated yet.
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="(flashcard, index) in flashcards"
          :key="index"
          class="flip-card"
        >
          <div class="flip-card-inner">
            <!-- Front -->
            <div class="flip-card-front">
              <h3 class="text-center font-bold">{{ flashcard.front }}</h3>
            </div>
            <!-- Back -->
            <div class="flip-card-back">
              <p class="text-center">{{ flashcard.back }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const messageContent = ref('')
const flashcards = ref([])
const loading = ref(false)

// Trigger hidden file input
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Generate Flashcards
const generateFlashcards = async () => {
  if (!messageContent.value.trim()) {
    flashcards.value = [
      { front: 'Error', back: 'Please provide content to generate flashcards.' }
    ]
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
                  text: `Based on the following content:\n\n${messageContent.value}\n\nGenerate 10 flashcards in JSON format with fields "front" and "back".`
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const rawText = data.candidates[0].content.parts[0].text
      flashcards.value = parseFlashcards(rawText)
    } else {
      flashcards.value = [
        { front: 'Error', back: 'Failed to generate flashcards.' }
      ]
    }
  } catch (error) {
    console.error('Error:', error)
    flashcards.value = [
      { front: 'Error', back: 'Error generating flashcards. Please try again.' }
    ]
  } finally {
    loading.value = false
  }
}

// Parse Gemini AI Output into Flashcards
const parseFlashcards = text => {
  try {
    const jsonMatch = text.match(/\[.*\]/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('JSON Parse Error:', error)
  }

  const lines = text.split('\n').filter(q => q.trim())
  return lines.map(line => {
    const [front, back] = line.split(':')
    return {
      front: front?.trim() || 'Unknown',
      back: back?.trim() || 'No definition provided'
    }
  })
}

// Handle PDF Upload
const handleFileUpload = async event => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    messageContent.value = await extractTextFromPDF(file)
  }
}

// Extract Text from PDF
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

<style scoped>
/* Flip Card Animation */
.flip-card {
  width: 100%;
  height: 120px;
  perspective: 1000px;
}

.flip-card-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flip-card-front {
  background-color: #111c44;
  color: white;
}

.flip-card-back {
  background-color: #5d3bea;
  color: white;
  transform: rotateY(180deg);
}
</style>
