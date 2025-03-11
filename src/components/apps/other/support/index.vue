<template>
  <div class="flex flex-col gap-4 lg:h-screen">
    <!-- Feedback Form -->
    <div
      class="mx-auto w-full rounded-xl bg-white p-8 shadow-sm dark:bg-[#111C44] dark:text-white"
    >
      <UInput
        variant="none"
        class="my-2 w-full rounded-lg border bg-gray-200 p-2 pr-6 dark:border-[#0C1438] dark:bg-[#111C44]"
        placeholder="Your name"
        v-model="name"
        maxLength="250"
      />

      <UInput
        variant="none"
        class="my-2 w-full rounded-lg border bg-gray-200 p-2 pr-6 dark:border-[#0C1438] dark:bg-[#111C44]"
        placeholder="Your email"
        v-model="email"
        maxLength="250"
      />

      <UTextarea
        variant="none"
        class="my-2 h-[300px] w-full rounded-lg border bg-gray-200 p-2 pr-6 dark:border-[#0C1438] dark:bg-[#111C44]"
        placeholder="Your message"
        v-model="message"
        maxLength="250"
      />
      <UButton
        variant="blue"
        class="flex w-40 rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        @click="submitFeedback"
      >
        {{ loading ? 'Sending...' : 'Send feedback' }}
      </UButton>

      <p v-if="successMessage" class="text-green-600">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- Live Chat Button -->
    <button
      class="fixed bottom-12 right-6 z-50 flex items-center justify-center rounded-full bg-[#5D3BEA] p-4 text-white shadow-lg transition hover:scale-110 hover:bg-[#4A2DCA] lg:bottom-6"
      @click="toggleChat"
    >
      💬
    </button>

    <!-- Toast Notification (Above Live Chat Button) -->
    <div
      v-if="showToast"
      class="fixed bottom-24 right-6 z-50 rounded-lg bg-[#5D3BEA] px-4 py-2 text-white shadow-lg transition-opacity duration-500"
    >
      {{ toastMessage }}
    </div>

    <!-- Chat Popup -->
    <div
      v-if="chatOpen"
      class="fixed bottom-20 right-6 w-80 rounded-lg bg-white p-4 shadow-lg dark:bg-[#111C44]"
    >
      <div class="flex justify-between border-b pb-2 dark:border-[#0C1438]">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Live Chat
        </h2>
        <button @click="toggleChat" class="text-gray-600 dark:text-white">
          ✖
        </button>
      </div>

      <div class="h-60 overflow-y-auto p-2">
        <div v-for="(chat, index) in chats" :key="index" class="mb-2">
          <span class="font-bold text-[#5D3BEA]">{{ chat.user }}:</span>
          <span class="text-gray-800 dark:text-white"> {{ chat.message }}</span>
        </div>
      </div>

      <div class="mt-2 flex flex-col gap-2">
        <UInput
          variant="none"
          class="rounded-lg border bg-gray-200 dark:border-[#0C1438] dark:bg-[#111C44]"
          placeholder="Type your message"
          v-model="chatMessage"
          maxLength="250"
        />
        <UButton
          variant="blue"
          class="flex w-full items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
          @click="sendMessage"
        >
          Send
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useUser } from '~/composables/useUser'

const { userInfo } = useUser()
const name = ref('')
const email = ref('')
const message = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const chatMessage = ref('')
const chats = ref([])
const chatOpen = ref(false)

// Toast State
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = message => {
  toastMessage.value = message
  showToast.value = true

  // Auto-hide after 8 seconds
  setTimeout(() => {
    showToast.value = false
  }, 8000)
}

onMounted(() => {
  if (userInfo.value) {
    name.value = userInfo.value.name || ''
    email.value = userInfo.value.email || ''
  }
  triggerToast('Hello! How can we help you?')
})

watchEffect(() => {
  if (userInfo.value) {
    name.value = userInfo.value.name || ''
    email.value = userInfo.value.email || ''
  }
})

const submitFeedback = async () => {
  if (!name.value || !email.value || !message.value) {
    errorMessage.value = 'Please fill in all fields!'
    triggerToast('Please fill in all fields!')
    return
  }

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/create-feedback',
      {
        name: name.value,
        email: email.value,
        message: message.value
      }
    )

    successMessage.value = 'Feedback submitted successfully!'
    triggerToast('Feedback submitted successfully!')
    message.value = ''
  } catch (error) {
    errorMessage.value = 'Error submitting feedback. Please try again.'
    triggerToast('Submission failed!')
  } finally {
    loading.value = false
  }
}

const sendMessage = () => {
  if (!chatMessage.value) return
  chats.value.push({ user: 'You', message: chatMessage.value })
  triggerToast('Message sent!')
  chatMessage.value = ''
}

const toggleChat = () => {
  chatOpen.value = !chatOpen.value

  // Hide toast when chat button is clicked
  if (showToast.value) {
    showToast.value = false
  }
}
</script>
