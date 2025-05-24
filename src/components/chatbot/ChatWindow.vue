<script setup lang="ts">
import { useChatStore } from '@/store/chat'

const props = defineProps<{ showSidebar: boolean }>()
const emit = defineEmits(['toggle-sidebar'])

const chatStore = useChatStore()
const newMessage = ref('')
const loading = ref(false)
const chatWindowRef = ref<HTMLElement>()
const inputBarWidth = ref('100%')

const updateInputBarWidth = () => {
  if (chatWindowRef.value) {
    inputBarWidth.value = chatWindowRef.value.offsetWidth + 'px'
  }
}

onMounted(() => {
  updateInputBarWidth()
  window.addEventListener('resize', updateInputBarWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateInputBarWidth)
})

watchEffect(async () => {
  if (chatStore.activeChatId) {
    nextTick(() => updateInputBarWidth())
  }
})

const sendMessage = async () => {
  if (!newMessage.value) return
  const userId = sessionStorage.getItem('user_id')
  const chatTitle = chatStore.chats.find(
    chat => chat.key == chatStore.activeChatId
  )
  loading.value = true
  await chatStore.sendChat(
    String(chatStore.activeChatId),
    String(chatTitle?.title) || String(chatStore.activeChatId),
    String(userId),
    newMessage.value
  )
  loading.value = false
  newMessage.value = ''
  nextTick(() => {
    scrollToBottom()
    updateInputBarWidth()
  })
}

const scrollToBottom = () => {
  const chatContainer = document.querySelector('.chat-container')
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
}
</script>

<template>
  <div
    ref="chatWindowRef"
    class="relative flex h-screen w-full flex-col bg-white p-4 dark:bg-[#0C1438] dark:text-white"
  >
    <!-- Toggle Sidebar Button -->
    <button
      class="fixed bottom-20 right-4 z-50 rounded-2xl bg-gray-200 px-3 py-1 text-gray-700 shadow-md transition hover:bg-gray-300 dark:bg-[#1E2A5A] dark:text-white dark:hover:bg-[#22336a] md:bottom-24 lg:absolute lg:bottom-auto lg:left-2 lg:right-auto lg:top-2 lg:z-30"
      @click="emit('toggle-sidebar')"
      aria-label="Toggle Sidebar"
    >
      {{ props.showSidebar ? 'Hide' : 'Show' }} Chat History
    </button>

    <!-- Chat Messages -->
    <div class="chat-container flex-1 space-y-2 overflow-auto">
      <div v-if="loading" class="flex h-full items-center justify-center">
        <svg
          class="h-8 w-8 animate-spin text-blue-500 dark:text-[#5D3BEA]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <span class="ml-2 text-blue-500 dark:text-[#5D3BEA]">Loading...</span>
      </div>
      <template v-else>
        <div
          v-for="(msg, index) in chatStore.messages"
          :key="index"
          :class="[
            'flex w-full',
            msg.sender === 'me' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-[70%] break-words rounded-md p-2',
              msg.sender === 'me'
                ? 'self-end bg-blue-500 text-white'
                : 'self-start bg-gray-200 text-gray-900 dark:bg-[#1A2B5F] dark:text-white'
            ]"
          >
            {{ msg.text }}
          </div>
        </div>
      </template>
    </div>

    <!-- Message Input -->
    <div
      class="fixed bottom-2 z-50 flex w-full items-center rounded border bg-white p-2 dark:border-[#1E2A50] dark:bg-[#111C44] sm:p-4 lg:bottom-4 lg:z-0"
      :style="{
        width: inputBarWidth,
        left: chatWindowRef?.getBoundingClientRect().left + 'px'
      }"
      style="right: auto"
    >
      <form
        @submit.prevent="sendMessage"
        class="mx-auto flex w-full max-w-3xl items-center gap-1 sm:gap-2"
      >
        <input
          v-model="newMessage"
          placeholder="Type a message..."
          class="min-w-0 flex-1 rounded-md border p-1 text-sm focus:outline-none focus:ring focus:ring-blue-400 dark:border-[#1E2A50] dark:bg-[#1A2B5F] dark:text-white sm:p-2 sm:text-base"
          :disabled="loading"
        />
        <button
          type="submit"
          :disabled="loading"
          class="ml-1 transform whitespace-nowrap rounded-md bg-blue-500 px-2 py-1 text-sm text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-blue-600 active:scale-95 disabled:opacity-50 dark:bg-[#5D3BEA] dark:hover:bg-[#4A2DCA] sm:ml-2 sm:px-4 sm:py-2 sm:text-base"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>
