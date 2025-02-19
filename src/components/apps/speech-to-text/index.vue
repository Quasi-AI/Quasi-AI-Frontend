<template>
  <div class="flex flex-col items-center justify-center gap-6 px-5 lg:flex-row">
    <div class="flex w-full flex-col items-center gap-4">
      <!-- Preview Section -->
      <div class="flex w-full flex-col lg:w-[50%]">
        <h2 class="mb-2 text-lg font-bold">Preview</h2>
        <div v-if="messageContent.length === 0" class="text-gray-500">
          No content recognized yet.
        </div>
        <div
          v-else
          class="rounded-2xl bg-white p-4 shadow dark:bg-[#111C44] dark:text-white"
        >
          {{ messageContent }}
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-2 flex gap-4">
        <UButton
          class="rounded-full bg-red-200 p-3 dark:bg-gray-700"
          @click="toggleSpeechToText"
        >
          <font-awesome-icon :icon="['fas', 'microphone']" />
          {{ isListening ? 'Pause' : 'Start Speech-to-Text' }}
        </UButton>

        <UButton
          class="rounded-full bg-gray-200 p-3 dark:bg-gray-700"
          @click="clearPreview"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
          Clear
        </UButton>
      </div>
    </div>

    <!-- Saved Transcripts Section -->
    <div class="flex w-full flex-col lg:w-[50%]">
      <h2 class="mb-2 text-lg font-bold">Saved Transcripts</h2>
      <div v-if="savedTranscripts.length === 0" class="text-gray-500">
        No transcripts saved yet.
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="(transcript, index) in savedTranscripts"
          :key="index"
          class="cursor-pointer rounded-2xl bg-white p-4 shadow hover:bg-gray-100 dark:bg-[#111C44] dark:text-white dark:hover:bg-gray-700"
        >
          <div class="flex items-center justify-between">
            <div @click="viewTranscript(transcript)">
              <p class="font-semibold">Transcript {{ index + 1 }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ transcript.content.substring(0, 50) }}...
              </p>
            </div>
            <UButton
              variant="none"
              class="h-4 rounded-md bg-red-500 px-2 text-white"
              @click.stop="deleteTranscript(index)"
            >
              Remove
              <font-awesome-icon :icon="['fas', 'trash']" />
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

// Clear preview and stop recognition
const clearPreview = () => {
  messageContent.value = ''
  finalizedText.value = ''
  if (isListening.value) {
    recognition.stop()
    isListening.value = false
  }
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
