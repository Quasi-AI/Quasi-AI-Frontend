<template>
  <div class="flex flex-col gap-4 lg:flex-row">
    <!-- Feedback Form -->
    <div class="flex w-full flex-col gap-6 lg:w-1/2">
      <UInput
        variant="none"
        class="my-2 w-full rounded-lg bg-gray-200 p-2 pr-6 dark:bg-[#111C44]"
        placeholder="Your name"
        v-model="name"
        maxLength="250"
      />

      <UInput
        variant="none"
        class="my-2 w-full rounded-lg bg-gray-200 p-2 pr-6 dark:bg-[#111C44]"
        placeholder="Your email"
        v-model="email"
        maxLength="250"
      />

      <UTextarea
        variant="none"
        class="my-2 w-full rounded-lg bg-gray-200 p-2 pr-6 dark:bg-[#111C44]"
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
    <!-- Live Chat Section -->
    <div class="flex w-full flex-col lg:w-1/2">
      <h2 class="py-4 text-2xl font-bold text-gray-800 dark:text-white">
        Live Chat
      </h2>

      <div
        class="h-[50vh] w-full overflow-y-auto rounded-lg bg-gray-100 p-4 dark:bg-[#111C44]"
      >
        <div v-for="(chat, index) in chats" :key="index" class="mb-2">
          <span class="font-bold text-[#5D3BEA]">{{ chat.user }}:</span>
          <span class="text-gray-800 dark:text-white">{{ chat.message }}</span>
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2">
        <UInput
          variant="none"
          class="my-2 rounded-lg bg-gray-200 p-2 pr-6 dark:bg-[#111C44]"
          placeholder="Type your message"
          v-model="ChatMessage"
          maxLength="250"
        />
        <UButton
          variant="blue"
          class="flex w-40 items-center justify-center rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
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

const name = ref('')
const email = ref('')
const message = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const chatMessage = ref('')
const chats = ref([])

const submitFeedback = async () => {
  if (!name.value || !email.value || !message.value) {
    errorMessage.value = 'Please fill in all fields!'
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
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (error) {
    errorMessage.value = 'Error submitting feedback. Please try again.'
  } finally {
    loading.value = false
  }
}

const sendMessage = () => {
  if (!chatMessage.value) return
  chats.value.push({ user: 'You', message: chatMessage.value })
  chatMessage.value = ''
}
</script>
