<template>
  <div class="flex flex-col gap-6 lg:flex-row">
    <div class="flex w-full flex-col items-center gap-4">
      <!-- Preview Section -->
      <div class="w-full rounded-lg bg-white p-6 dark:bg-[#111C44]">
        <SpeechIcon
          v-if="messageContent.length === 0"
          width="100%"
          height="100%"
        />
        <div
          v-else
          class="rounded-lg bg-gray-100 p-4 dark:bg-[#0C1438] dark:text-white"
        >
          {{ messageContent }}
        </div>
      </div>

      <!-- Buttons -->
      <div
        class="mt-4 flex w-full justify-center rounded-lg bg-white p-6 dark:bg-[#111C44]"
      >
        <UButton
          variant="blue"
          class="flex w-[200px] items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
          @click="toggleSpeechToText"
        >
          <font-awesome-icon :icon="['fas', 'microphone']" class="mr-2" />
          {{ isListening ? 'Pause' : 'Start speaking' }}
        </UButton>
      </div>
    </div>

    <!-- Saved Transcripts Section -->
    <div class="w-full rounded-lg bg-white p-6 dark:bg-[#111C44]">
      <h2 class="mb-4 text-lg font-bold text-gray-700 dark:text-gray-300">
        Saved Transcripts
      </h2>
      <div
        v-if="savedTranscripts.length === 0"
        class="text-gray-500 dark:text-gray-400"
      >
        No transcripts saved yet.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="(transcript, index) in savedTranscripts"
          :key="index"
          class="cursor-pointer rounded-lg bg-[#EDEDF2] p-4 hover:bg-gray-200 dark:bg-[#0C1438] dark:text-white dark:hover:bg-gray-700"
        >
          <div class="flex items-center justify-between">
            <div @click="viewTranscript(transcript)">
              <p class="font-semibold">
                {{ formatTranscriptTitle(transcript) }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ transcript.content.substring(0, 50) }}...
              </p>
            </div>
            <div class="flex gap-3">
              <!-- Download button -->
              <button
                class="text-blue-500 transition hover:text-blue-700"
                @click.stop="downloadTranscript(transcript)"
              >
                Download
              </button>

              <!-- Delete button -->
              <button
                class="text-red-500 transition hover:text-red-700"
                @click.stop="deleteTranscript(index)"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SpeechIcon from '@/assets/icons/speech-icon.vue'

const messageContent = ref('')
const isListening = ref(false)
const savedTranscripts = ref([])
const finalizedText = ref('')
const user_id = sessionStorage.getItem('user_id')

// Function to check speech recognition support
const isSpeechRecognitionSupported = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

if (!isSpeechRecognitionSupported()) {
  alert(
    'Speech-to-text is not supported in this browser. Please use Chrome or Edge.'
  )
}

// Load saved transcripts for the current user
onMounted(() => {
  const saved = sessionStorage.getItem('savedTranscripts')
  if (saved) {
    savedTranscripts.value = JSON.parse(saved).filter(
      t => t.user_id === user_id
    )
  }
})

// Speech Recognition Setup
let recognition = null
if (isSpeechRecognitionSupported()) {
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'en-US'

  // Handle speech recognition results
  recognition.onresult = event => {
    let interimTranscript = ''

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalizedText.value += formatTranscript(transcript)
      } else {
        interimTranscript += transcript
      }
    }

    messageContent.value = finalizedText.value + interimTranscript
  }

  // Handle errors and end of recognition
  recognition.onerror = event => {
    console.error('Speech recognition error:', event.error)
    isListening.value = false
  }

  recognition.onend = () => {
    isListening.value = false
    saveTranscript()
  }
}

// Format transcript by adding punctuation
const formatTranscript = text => {
  text = text.trim()
  if (text.length > 0) {
    return text.charAt(0).toUpperCase() + text.slice(1) + '. '
  }
  return text
}

// Generate a title for each transcript using date and content snippet
const formatTranscriptTitle = transcript => {
  const date = new Date(transcript.timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  const snippet = transcript.content.substring(0, 20) + '...'
  return `${date} - ${snippet}`
}

// Toggle speech-to-text
const toggleSpeechToText = () => {
  if (!isSpeechRecognitionSupported()) return

  if (isListening.value) {
    recognition.stop()
  } else {
    recognition.start()
  }
  isListening.value = !isListening.value
}

// Save transcript with user_id and timestamp
const saveTranscript = () => {
  if (messageContent.value.trim()) {
    const transcript = {
      user_id: user_id,
      timestamp: Date.now(),
      content: messageContent.value
    }

    const saved = sessionStorage.getItem('savedTranscripts')
    let allTranscripts = saved ? JSON.parse(saved) : []
    allTranscripts.push(transcript)

    sessionStorage.setItem('savedTranscripts', JSON.stringify(allTranscripts))
    savedTranscripts.value = allTranscripts.filter(t => t.user_id === user_id)

    messageContent.value = ''
    finalizedText.value = ''
  }
}

// View a saved transcript
const viewTranscript = transcript => {
  messageContent.value = transcript.content
}

// Delete a saved transcript
const deleteTranscript = index => {
  const saved = sessionStorage.getItem('savedTranscripts')
  let allTranscripts = saved ? JSON.parse(saved) : []

  const userTranscripts = allTranscripts.filter(t => t.user_id === user_id)
  userTranscripts.splice(index, 1)

  allTranscripts = allTranscripts
    .filter(t => t.user_id !== user_id)
    .concat(userTranscripts)
  sessionStorage.setItem('savedTranscripts', JSON.stringify(allTranscripts))

  savedTranscripts.value = userTranscripts
}

// Download transcript as a .txt file
const downloadTranscript = transcript => {
  const formattedDate = new Date(transcript.timestamp)
    .toISOString()
    .replace(/[:.]/g, '-')
  const snippet = transcript.content.substring(0, 20).replace(/\s+/g, '_')
  const filename = `transcript-${formattedDate}-${snippet}.txt`

  const blob = new Blob([transcript.content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
</script>
