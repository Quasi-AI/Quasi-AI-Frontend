<script setup lang="ts">
import { ref, watchEffect, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useChatStore } from '@/store/chat'

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
    loading.value = true
    await chatStore.fetchChat(chatStore.activeChatId)
    loading.value = false
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
  <div ref="chatWindowRef" class="flex h-screen w-full flex-col p-4 bg-white dark:bg-[#111C44]">
    <!-- Chat Messages -->
    <div class="chat-container flex-1 space-y-2 overflow-auto">
      <div v-if="loading" class="flex justify-center items-center h-full">
        <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span class="ml-2 text-blue-500">Loading...</span>
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
              'rounded-md p-2 max-w-[70%] break-words',
              msg.sender === 'me'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-gray-900 self-start'
            ]"
          >
            {{ msg.text }}
          </div>
        </div>
      </template>
    </div>

    <!-- Message Input -->
    <div
      class="fixed flex items-center border bg-white p-4 dark:bg-[#111C44] lg:bottom-4 rounded"
      :style="{ width: inputBarWidth, left: chatWindowRef?.getBoundingClientRect().left + 'px' }"
      style="right:auto"
    >
      <div class="mx-auto flex max-w-3xl w-full items-center gap-2">
        <input
          v-model="newMessage"
          placeholder="Type a message..."
          class="flex-1 rounded-md border p-2 focus:outline-none focus:ring focus:ring-blue-400"
          :disabled="loading"
        />
        <button
          @click="sendMessage"
          :disabled="loading"
          class="ml-2 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-blue-600 active:scale-95 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>
