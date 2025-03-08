<template>
  <div class="flex flex-col gap-6 lg:flex-row">
    <!-- Speech-to-Text Section -->
    <div class="flex w-full flex-col items-center gap-4">
      <!-- Preview Section -->
      <div class="w-full rounded-lg bg-white p-6 dark:bg-[#111C44]">
        <SpeechIcon v-if="messageContent.length === 0" />
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
    <div class="w-full">
      <div
        v-if="savedTranscripts.length > 0"
        class="my-4 flex w-full justify-end"
      >
        <UButton
          variant="blue"
          class="flex w-[180px] items-center justify-end rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:bg-[#4A2DCA]"
        >
          Download transcript
        </UButton>
      </div>

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
                <p class="font-semibold">Transcript {{ index + 1 }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ transcript.content.substring(0, 50) }}...
                </p>
              </div>
              <button
                class="text-red-500 transition hover:text-red-700"
                @click="closeModal"
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
const user_id = localStorage.getItem('user_id')

// Load saved transcripts for the current user
onMounted(() => {
  const saved = localStorage.getItem('savedTranscripts')
  if (saved) {
    savedTranscripts.value = JSON.parse(saved).filter(
      t => t.user_id === user_id
    )
  }
})

// Speech Recognition Setup
const recognition = new (window.SpeechRecognition ||
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
      finalizedText.value += transcript + ' '
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

// Toggle speech-to-text
const toggleSpeechToText = () => {
  if (isListening.value) {
    recognition.stop()
  } else {
    recognition.start()
  }
  isListening.value = !isListening.value
}

// Save transcript with user_id
const saveTranscript = () => {
  if (messageContent.value.trim()) {
    const transcript = {
      user_id: user_id,
      content: messageContent.value
    }

    const saved = localStorage.getItem('savedTranscripts')
    let allTranscripts = saved ? JSON.parse(saved) : []
    allTranscripts.push(transcript)

    localStorage.setItem('savedTranscripts', JSON.stringify(allTranscripts))
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
  const saved = localStorage.getItem('savedTranscripts')
  let allTranscripts = saved ? JSON.parse(saved) : []

  const userTranscripts = allTranscripts.filter(t => t.user_id === user_id)
  userTranscripts.splice(index, 1)

  allTranscripts = allTranscripts
    .filter(t => t.user_id !== user_id)
    .concat(userTranscripts)
  localStorage.setItem('savedTranscripts', JSON.stringify(allTranscripts))

  savedTranscripts.value = userTranscripts
}
</script>

<style scoped>
/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #5d3be9;
  border-radius: 10px;
}
</style>
