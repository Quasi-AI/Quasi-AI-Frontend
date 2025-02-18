<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
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
          <p><strong>Accepted File Types: (.pdf *, .docx)</strong></p>
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

      <!-- Submit Button -->
      <UButton
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="loading"
        @click="analyzeEssay"
        variant="blue"
      >
        <span v-if="!isLoading">Analyze Essay</span>
        <span v-else class="flex items-center rounded-2xl">
          <Loader class="h-5 w-5" />
        </span>
      </UButton>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Flashcards Preview -->
    <div class="flex w-full flex-col lg:w-[50%]">
      <h2 class="mb-2 text-lg font-bold">Preview</h2>
      <div v-if="flashcards.length === 0" class="text-gray-500">
        No essay analyze yet.
      </div>
    </div>
  </div>

  <!-- Hidden File Input -->
  <input
    type="file"
    id="file-upload"
    style="display: none"
    @change="handleFileChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Loader from '@/components/loader/Loader.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import PPTX2Json from 'pptx2json'
import axios from 'axios' // Import axios

// Specify the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js'

// Add microphone icon to FontAwesome library
library.add(faMicrophone)

const messageContent = ref('')
const flashcards = ref([])
const loading = ref(false)
const isLoading = ref(false)
const errorMessage = ref('') // New variable for error message

// Trigger the hidden file input when the button is clicked
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Handle the file selection
const handleFileChange = async event => {
  const file = event.target.files[0]

  if (!file) return

  const fileType = file.type
  errorMessage.value = '' // Clear previous error message

  // PDF Handling
  if (fileType === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = async e => {
      const pdfData = new Uint8Array(e.target.result)
      const pdf = await pdfjsLib.getDocument(pdfData).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(item => item.str).join(' ') + '\n'
      }
      messageContent.value = text
    }
    reader.readAsArrayBuffer(file)
  } else if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const reader = new FileReader()
    reader.onload = e => {
      const arrayBuffer = e.target.result

      // Extract text from the Word document using Mammoth
      mammoth
        .extractRawText({ arrayBuffer: arrayBuffer })
        .then(result => {
          messageContent.value = result.value // Set the extracted text in the textarea
        })
        .catch(err => {
          console.error('Error extracting text from DOCX:', err)
        })
    }
    reader.readAsArrayBuffer(file)
  }

  // PPTX Handling (using pptx2json)
  else if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    const reader = new FileReader()

    reader.onload = async e => {
      const arrayBuffer = e.target.result

      try {
        // Parse the PPTX file
        const pptx = new PPTX2Json()
        pptx.load(arrayBuffer)

        // Extracting the slide content
        pptx
          .getSlides()
          .then(slides => {
            let text = ''
            slides.forEach(slide => {
              slide.texts.forEach(textItem => {
                text += textItem.text + ' '
              })
            })
            messageContent.value = text // Set the extracted text in the textarea
          })
          .catch(err => {
            console.error('Error extracting slides:', err)
          })
      } catch (err) {
        console.error('Error extracting text from PPTX:', err)
      }
    }
    reader.readAsArrayBuffer(file)
  } else {
    errorMessage.value =
      'Unsupported file type. Please upload a PDF, DOCX, or Audio file.'
  }
}

const analyzeEssay = async () => {
  try {
    isLoading.value = true

    // Create the request body
    const requestBody = {
      user_id: localStorage.getItem('user_id'),
      message: messageContent.value
    }

    // Make the API call using axios
    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/analyze/generate',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    // Handle the response
    if (response.status === 200) {
      flashcards.value = response.data.essays || []
    } else {
      errorMessage.value = response.error
    }
  } catch (err) {
    errorMessage.value = response.error
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
