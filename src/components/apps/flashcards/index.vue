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
      <div class="text-center text-gray-600 dark:text-gray-300 mt-4">
        <p>Please upload one of the following file types:</p>
        <ul class="list-disc pl-5">
          <li>PDF</li>
          <li>Word Documents (.docx)</li>
          <li>Audio Files (e.g., .mp3, .wav)</li>
        </ul>
      </div>

      <!-- File Icons -->
      <div class="flex gap-4 mt-4">
        <!-- Audio Recording Icon -->
        <UButton
          class="rounded-full bg-red-200 p-3 dark:bg-gray-700"
          @click="triggerFileInput"
        >
          <font-awesome-icon :icon="['fas', 'file']" />
        </UButton>
      </div>

      <!-- Submit Button -->
      <UButton
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="loading"
        @click="generateFlashcards"
        variant="blue"
      >
        <span v-if="!isLoading">Generate Flashcards</span>
        <span v-else class="flex items-center rounded-2xl">
          <Loader class="w-5 h-5" />
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
        No flashcards generated yet.
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div v-for="(flashcard, index) in flashcards" :key="index" class="flip-card">
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

  <!-- Hidden File Input -->
  <input type="file" id="file-upload" style="display: none" @change="handleFileChange" />
</template>


<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Loader from "@/components/loader/Loader.vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from "mammoth";
import PPTX2Json from 'pptx2json';

// Specify the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

// Add microphone icon to FontAwesome library
library.add(faMicrophone);

const messageContent = ref('');
const flashcards = ref([]);
const loading = ref(false);
const isLoading = ref(false);
const errorMessage = ref(''); // New variable for error message

// Trigger the hidden file input when the button is clicked
const triggerFileInput = () => {
  document.getElementById('file-upload').click();
};

// Handle the file selection
const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const fileType = file.type;
  errorMessage.value = ''; // Clear previous error message

  // PDF Handling
  if (fileType === 'application/pdf') {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const pdfData = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument(pdfData).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      messageContent.value = text;
    };
    reader.readAsArrayBuffer(file);
  }

  else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;

        // Extract text from the Word document using Mammoth
        mammoth.extractRawText({ arrayBuffer: arrayBuffer })
          .then((result) => {
            messageContent.value = result.value;  // Set the extracted text in the textarea
          })
          .catch((err) => {
            console.error("Error extracting text from DOCX:", err);
          });
      };
      reader.readAsArrayBuffer(file);
    }

  // PPTX Handling (using pptx2json)
  else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      try {
        // Parse the PPTX file
        const pptx = new PPTX2Json();
        pptx.load(arrayBuffer);

        // Extracting the slide content
        pptx.getSlides().then(slides => {
          let text = '';
          slides.forEach(slide => {
            slide.texts.forEach(textItem => {
              text += textItem.text + ' ';
            });
          });
          messageContent.value = text;  // Set the extracted text in the textarea
        }).catch(err => {
          console.error("Error extracting slides:", err);
        });
      } catch (err) {
        console.error("Error extracting text from PPTX:", err);
      }
    };
    reader.readAsArrayBuffer(file);
  }
  
  // Audio Handling (basic example, can be expanded with speech-to-text libraries)
  else if (fileType.startsWith('audio/')) {
    // Example: Extract metadata or transcribe audio (e.g., using Google Speech API)
    const text = 'Audio recording transcribed content';
    messageContent.value = text;
  } else {
    errorMessage.value = 'Unsupported file type. Please upload a PDF, DOCX, or Audio file.';
  }
};

// Generate Flashcards (mockup function)
const generateFlashcards = () => {
  
  // Logic to generate flashcards

  try{
    isLoading.value = true
    console.log('Generating Flashcards');
    flashcards.value = [{ front: 'Example Question', back: 'Answer' }];

  }catch (err) {
        console.error("Error extracting text from PPTX:", err);
  }finally{
    isLoading.value = false
  }
};
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
