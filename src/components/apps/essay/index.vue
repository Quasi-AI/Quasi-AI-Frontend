<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <!-- Left Section: Text Area & Upload -->
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

      <!-- Submit Button -->
      <UButton
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="isLoading"
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

    <!-- Right Section: Results -->

    <div class="flex w-full flex-col lg:w-[50%] p-5 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h2 class="mb-2 text-lg font-bold">Results</h2>

      <!-- Show message if no essay has been analyzed -->
      <div v-if="!essay" class="text-gray-500 text-center">
        No essay analyzed yet.
      </div>

      <!-- Show analyzed essay with highlighted mistakes -->
      <div 
        v-else 
        class="relative border border-gray-300 p-5 bg-gray-100 dark:bg-gray-700 rounded-md max-h-[60vh] overflow-y-auto"
      >
        <p v-html="formattedEssay"></p>
      </div>

      <!-- Beautiful Circle Chart for Mistakes -->
      <div v-if="essay" class="mt-5 flex justify-center">
        <DoughnutChart :chart-data="chartData" :chart-options="chartOptions" class="w-40 h-40" />
      </div>
    </div>
  </div>

  <!-- Hidden File Input -->
  <input type="file" id="file-upload" style="display: none" @change="handleFileChange" />
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
import { defineChartComponent } from "vue-chart-3";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define Doughnut chart component
const DoughnutChart = defineChartComponent("doughnut");


import axios from 'axios' // Import axios

// Specify the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js'

// Add microphone icon to FontAwesome library
library.add(faMicrophone)

const messageContent = ref('')
const essay = ref('')
const loading = ref(false)
const isLoading = ref(false)
const mistakes = ref([])
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

const formattedEssay = computed(() => {
      if (!essay.value || !mistakes.value.length) return essay.value || "";

      let text = essay.value;
      mistakes.value.forEach(({ word }) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        text = text.replace(regex, `<span class="text-red-500 underline">${word}</span>`);
      });

      return text;
});

const totalWords = 100;
const chartData = computed(() => ({
  labels: ["Mistakes", "Correct"],
  datasets: [
    {
      data: [
        mistakes.value.length, // Reactive value
        Math.max(0, totalWords - mistakes.value.length),
      ],
      backgroundColor: ["#ff4d4d", "#4CAF50"],
      hoverOffset: 4,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom"
    }
  }
};

// Function to analyze the essay via API
const analyzeEssay = async () => {
  try {
      isLoading.value = true;
      errorMessage.value = "";

      const requestBody = {
        user_id: localStorage.getItem("user_id"),
        message: messageContent.value,
      };

      const response = await axios.post(
        "https://dark-caldron-448714-u5.uc.r.appspot.com/analyze/generate",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response
      if (response.data.message) {
        essay.value = response.data.message; // Store original essay
        mistakes.value = response.data.mistakes || []; // Store mistakes if available
      } else {
        errorMessage.value = "Unexpected response from server.";
      }
    } catch (err) {
      errorMessage.value = err.message || "Failed to analyze essay.";
    } finally {
      isLoading.value = false;
  }
};
</script>

<style scoped>
.border-paper {
  border: 2px solid #ccc;
  background: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Times New Roman", serif;
  min-height: 40vh;
  max-width: 100%;
  line-height: 1.6;
}

.text-red-500 {
  color: red;
  text-decoration: underline;
}
</style>

