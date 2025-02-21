<template>
  <div class="flex flex-col items-center justify-center lg:flex-row">
    <!-- Chat Container -->
    <div class="flex flex-row-reverse overflow-hidden">
      <!-- Chat Messages -->
      <div
        ref="chatBodyRef"
        class="flex flex-grow justify-center overflow-y-auto p-2 pb-20"
      >
        <div
          class="w-full rounded-xl bg-white p-3 lg:w-[450px] dark:bg-[#111C44]"
        >
          <ChatBotMessage
            v-for="(chat, index) in chatHistory"
            :key="index"
            :chat="chat"
          />
        </div>
      </div>

      <!-- Chat History Sidebar -->
      <aside
        class="hidden w-[250px] overflow-y-auto p-4 lg:block dark:border-gray-700"
      >
        <p class="py-1 text-center text-xs italic text-gray-500">
          Chat History
        </p>
        <ul>
          <li
            v-for="(chat, index) in chatHistory"
            :key="index"
            class="mb-2 cursor-pointer rounded-md bg-white p-2 text-sm dark:bg-[#111C44] dark:text-white"
          >
            {{
              chat.text.length > 50 ? chat.text.slice(0, 50) + '...' : chat.text
            }}
          </li>
        </ul>

        <p class="py-1 text-center text-xs italic text-gray-500">
          Type "clear" to reset the chat
        </p>
      </aside>
    </div>

    <!-- Floating Input Box -->
    <div
      class="fixed bottom-2 w-[90%] rounded-full bg-white p-3 shadow-md sm:w-[80%] md:w-[60%] lg:bottom-4 lg:left-1/2 lg:w-[40%] lg:-translate-x-1/2 xl:w-[30%] dark:bg-[#111C44]"
    >
      <form @submit.prevent="handleSubmit" class="flex items-center gap-3">
        <input
          v-model="inputRef"
          :placeholder="inputPlaceholder"
          class="w-full rounded-md bg-white outline-none dark:bg-[#111C44]"
          required
        />
        <button type="submit">
          <sendMsgIcon />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import sendMsgIcon from '@/assets/icons/send-msg.vue'
import ChatBotMessage from './messages.vue'
import { generateBotResponse } from '@/utils/chatbot'
import { quasiAiTutor } from '@/prompts/chatbot'
import type { ChatMessage } from '~/types/chatbot'

defineProps({
  inputPlaceholder: {
    type: String,
    default: ''
  }
})

const chatHistory = ref<ChatMessage[]>([])
const chatBodyRef = ref<HTMLElement | null>(null)
const inputRef = ref('')
const userId = localStorage.getItem('user_id')

onMounted(async () => {
  const savedChatHistory = localStorage.getItem(`chatHistory_componentName`)
  if (savedChatHistory) {
    chatHistory.value = JSON.parse(savedChatHistory)
  } else {
    // todo: let use it at prop to make it optional
    const { quasiAiTutor } = await import('@/prompts/chatbot')
    chatHistory.value = [
      { hideInChat: true, role: 'model', text: quasiAiTutor }
    ]
  }
})

// Save chat history to localStorage
const saveChatHistory = () => {
  localStorage.setItem(
    `chatHistory_componentName`,
    JSON.stringify(chatHistory.value)
  )
}

const setChatHistory = (fn: (history: ChatMessage[]) => ChatMessage[]) => {
  chatHistory.value = fn(chatHistory.value)
  saveChatHistory()
}

const handleSubmit = () => {
  setTimeout(() => {
    chatBodyRef.value?.scrollTo({
      top: chatBodyRef.value.scrollHeight,
      behavior: 'smooth'
    })
  }, 100)

  if (!inputRef.value.trim()) return

  const userMessage = inputRef.value

  if (userMessage.toLowerCase() === 'clear') {
    localStorage.removeItem(`chatHistory_componentName`)
    chatHistory.value = [
      { hideInChat: true, role: 'model', text: quasiAiTutor }
    ]
    inputRef.value = ''
    return
  } else if (userMessage.toLowerCase() === 'logout') {
    window.location.reload()
    return
  }

  inputRef.value = ''

  setChatHistory(history => {
    const updatedHistory = [...history, { role: 'user', text: userMessage }]
    const thinkingHistory = [
      ...updatedHistory,
      { role: 'model', text: 'Thinking...' }
    ]

    setTimeout(() => {
      generateBotResponse(userId, userMessage, chatHistory)
    }, 600)

    return thinkingHistory
  })
}
</script>
