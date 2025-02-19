<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <div class="flex w-full flex-col items-center gap-4 lg:w-[50%]">
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Upload a document:</p>
        <strong>Accepted File Types: (.pdf, .docx)</strong>
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
        type="file"
        id="file-upload"
        style="display: none"
        @change="handleFileChange"
      />

      <UButton
        variant="blue"
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="isLoading"
        @click="analyzeEssay"
      >
        <span v-if="!isLoading">Analyze Essay</span>
        <span v-else>Loading...</span>
      </UButton>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>
    </div>

    <div
      class="flex w-full flex-col rounded-lg bg-white p-5 shadow-lg lg:w-[50%] dark:bg-gray-800"
    >
      <h2 class="mb-2 text-lg font-bold">Results</h2>
      <div v-if="!essay" class="text-center text-gray-500">
        No essay analyzed yet.
      </div>
      <div
        v-else
        class="relative max-h-[60vh] overflow-y-auto rounded-md border border-gray-300 bg-gray-100 p-5 dark:bg-gray-700"
      >
        <p>{{ essay }}</p>
      </div>
      <div v-if="essay" class="mt-5 flex justify-center">
        <Doughnut :data="chartData" :options="chartOptions" class="h-40 w-40" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import axios from 'axios'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const messageContent = ref('')
const essay = ref('')
const isLoading = ref(false)
const mistakes = ref([])
const errorMessage = ref('')

const totalWords = computed(() => {
  return messageContent.value.split(/\s+/).length || 100
})

const chartData = computed(() => ({
  labels: ['Mistakes', 'Correct'],
  datasets: [
    {
      data: [
        mistakes.value.length,
        Math.max(0, totalWords.value - mistakes.value.length)
      ],
      backgroundColor: ['#ff4d4d', '#4CAF50'],
      hoverOffset: 4
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    }
  }
}

const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

const handleFileChange = async event => {
  const file = event.target.files[0]
  if (!file) return

  const fileType = file.type
  errorMessage.value = ''

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
      mammoth
        .extractRawText({ arrayBuffer })
        .then(result => {
          messageContent.value = result.value
        })
        .catch(err => {
          console.error('Error extracting text from DOCX:', err)
        })
    }
    reader.readAsArrayBuffer(file)
  } else {
    errorMessage.value =
      'Unsupported file type. Please upload a PDF or DOCX file.'
  }
}

const analyzeEssay = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const requestBody = {
      user_id: localStorage.getItem('user_id'),
      message: messageContent.value
    }

    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/analyze/generate',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.message) {
      essay.value = response.data.message
      mistakes.value = response.data.mistakes || []
    } else {
      errorMessage.value = 'Unexpected response from server.'
    }
  } catch (err) {
    errorMessage.value = err.message || 'Failed to analyze essay.'
  } finally {
    isLoading.value = false
  }
}
</script>
