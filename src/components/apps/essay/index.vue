<template>
  <div class="flex flex-col gap-4 lg:flex-row">
    <div
      v-if="!showEssaysContainer"
      class="flex w-full flex-col items-center gap-4"
    >
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Upload a document:</p>
        <strong>Accepted File Types: (.pdf, .docx)</strong>
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

      <input
        type="file"
        id="file-upload"
        style="display: none"
        @change="handleFileChange"
      />

      <UButton
        variant="blue"
        class="flex w-[200px] items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
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
</script>

<style>
.underline {
  text-decoration: underline;
}
</style>
