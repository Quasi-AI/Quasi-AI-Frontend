<template>
  <div class="flex flex-col gap-4 lg:h-screen">
    <!-- Form Container -->
    <div
      v-if="!showEssaysContainer"
      class="mx-auto w-full rounded-xl bg-white p-8 shadow-sm dark:bg-[#111C44] dark:text-white"
    >
      <!-- Text Area for Essay Content -->
      <div class="mb-6">
        <p class="mb-2 block font-medium text-gray-500">Essay Content</p>
        <textarea
          v-model="messageContent"
          class="h-40 w-full rounded-lg border p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          placeholder="Type or paste your essay here"
        />
      </div>

      <!-- File Upload Section -->
      <div
        @click="triggerFileInput"
        class="mb-6 rounded-lg border-2 border-dashed border-blue-300 p-6 text-center"
      >
        <p class="font-medium text-gray-500">
          Click or drag and drop to upload an essay document
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

      <!-- Analyze Essay Button -->
      <div class="mt-6 flex justify-center">
        <button
          class="w-full max-w-xs rounded-lg bg-[#5D3BEA] py-3 font-medium text-white transition duration-300 hover:bg-[#4A2DCA] focus:ring-4 focus:ring-indigo-300"
          :disabled="isLoading"
          @click="analyzeEssay"
        >
          {{ isLoading ? 'Analyzing...' : 'Analyze Essay' }}
        </button>
      </div>

      <!-- Error Message Display -->
      <div v-if="errorMessage" class="mt-4 text-center text-red-500">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Results Section -->
    <div
      v-if="showEssaysContainer"
      class="flex w-full flex-col rounded-lg bg-white p-5 dark:bg-gray-800"
    >
      <h2 class="mb-2 text-lg font-bold">Results</h2>
      <div v-if="!essay" class="text-center text-gray-500">
        No essay analyzed yet.
      </div>
      <div
        v-else
        class="relative max-h-[60vh] overflow-y-auto rounded-md border border-gray-300 bg-gray-100 p-5 dark:bg-gray-700"
      >
        <!-- Render the essay with underlined mistakes -->
        <p v-html="formattedEssay"></p>
      </div>
      <div v-if="essay" class="mt-5 flex justify-center">
        <Doughnut :data="chartData" :options="chartOptions" class="h-40 w-40" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleFileUpload } from '@/utils/extractText'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import axios from 'axios'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const messageContent = ref('')
const essay = ref('')
const isLoading = ref(false)
const mistakes = ref([])
const errorMessage = ref('')
const showEssaysContainer = ref(false)

// Compute total words
const totalWords = computed(() => {
  return messageContent.value.split(/\s+/).length || 100
})

// Configure Chart Data
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

// Analyze Essay API Call
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
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (response.data.message) {
      essay.value = response.data.message
      mistakes.value = response.data.mistakes || []
      showEssaysContainer.value = true
    } else {
      errorMessage.value = 'Unexpected response from server.'
    }
  } catch (err) {
    errorMessage.value = err.message || 'Failed to analyze essay.'
  } finally {
    isLoading.value = false
  }
}

// Format essay with underlined mistakes
const formattedEssay = computed(() => {
  let text = essay.value
  if (!mistakes.value || !Array.isArray(mistakes.value)) return text

  mistakes.value.forEach(mistakeObj => {
    const mistakeText = mistakeObj.word || mistakeObj.text || mistakeObj // Extract mistake text properly
    if (typeof mistakeText === 'string') {
      const regex = new RegExp(`\\b${mistakeText}\\b`, 'gi')
      text = text.replace(
        regex,
        `<span class="underline text-red-500">${mistakeText}</span>`
      )
    }
  })

  return text
})

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

<style>
.underline {
  text-decoration: underline;
}
</style>
