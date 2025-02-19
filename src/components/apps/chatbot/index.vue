<template>
  <div class="flex flex-col 2xl:h-screen">
    <WindowsHeader />

    <!-- Chat Container -->
    <div class="flex flex-grow overflow-hidden">
      <!-- Chat Messages -->
      <div
        ref="chatBodyRef"
        class="w-3/4 flex-grow overflow-y-auto overflow-x-hidden p-2 pb-20"
      >
        <p class="mx-1 rounded-sm px-6 py-4">
          <ChatBotMessage
            v-for="(chat, index) in chatHistory"
            :key="index"
            :chat="chat"
          />
        </p>
      </div>

      <!-- Chat History Sidebar -->
      <aside
        class="hidden w-1/4 overflow-y-auto border-l p-4 lg:block dark:border-gray-700"
      >
        <h3 class="mb-2 text-lg font-semibold dark:text-white">Chat History</h3>
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
      </aside>
    </div>

    <!-- Floating Input Box -->
    <div
      class="fixed bottom-0 left-1/2 w-[90%] max-w-2xl -translate-x-1/2 rounded-t-xl bg-white p-3 shadow-md sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] dark:bg-[#111C44]"
    >
      <form @submit.prevent="handleSubmit" class="flex items-center gap-3">
        <input
          v-model="inputRef"
          placeholder="Type here..."
          class="w-full rounded-md bg-white px-4 py-2 outline-none dark:bg-[#111C44]"
          required
        />
        <button type="submit">
          <sendMsgIcon />
        </button>
      </form>
      <p class="py-1 text-center text-xs italic text-gray-500">
        Type "clear" to reset the chat
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import sendMsgIcon from '@/assets/icons/send-msg.vue'
import ChatBotMessage from './messages.vue'
import { generateBotResponse } from '@/utils/chatbot'
import { quasiAiTutor } from '@/prompts/chatbot'
import type { ChatMessage } from '~/types/chatbot'

const chatHistory = ref<ChatMessage[]>([])
const chatBodyRef = ref<HTMLElement | null>(null)
const inputRef = ref('')

onMounted(() => {
  const savedChatHistory = localStorage.getItem(`chatHistory_componentName`)
  chatHistory.value = savedChatHistory
    ? JSON.parse(savedChatHistory)
    : [{ hideInChat: true, role: 'model', text: quasiAiTutor }]
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
      generateBotResponse(
        [
          ...thinkingHistory.filter(msg => msg.text !== 'Thinking...'),
          {
            role: 'user',
            text: `Using the details provided above, please address this query: ${userMessage}.`
          }
        ],
        chatHistory
      )
    }, 600)

    return thinkingHistory
  })
}
</script>
