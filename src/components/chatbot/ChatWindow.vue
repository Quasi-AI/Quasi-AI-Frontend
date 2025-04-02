<script setup lang="ts">
import { ref, watchEffect, nextTick } from 'vue'
import { useChatStore } from '@/store/chat'
import ChatMessage from './ChatMessage.vue'

const chatStore = useChatStore()
const newMessage = ref('')

watchEffect(() => {
  if (chatStore.activeChatId) {
    chatStore.fetchChat(chatStore.activeChatId)
  }
})

const sendMessage = async () => {
  if (!newMessage.value) return
  const userId = sessionStorage.getItem('user_id')
  const chatTitle = chatStore.chats.find(
    chat => chat.key == chatStore.activeChatId
  )
  await chatStore.sendChat(
    String(chatStore.activeChatId),
    String(chatTitle?.title) || String(chatStore.activeChatId),
    String(userId),
    newMessage.value
  )
  newMessage.value = ''
  nextTick(() => scrollToBottom())
}

const scrollToBottom = () => {
  const chatContainer = document.querySelector('.chat-container')
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
}
</script>

<template>
  <div class="flex h-full flex-col p-4">
    <!-- Chat Messages -->
    <div class="chat-container flex-1 space-y-2 overflow-auto">
      <ChatMessage
        v-for="(msg, index) in chatStore.messages"
        :key="index"
        :text="msg.message"
        :sender="msg.message"
      />
    </div>

    <!-- Message Input -->
    <div
      class="fixed bottom-16 flex w-3/5 items-center border-t p-2 sm:bottom-4"
    >
      <input
        v-model="newMessage"
        placeholder="Type a message..."
        class="flex-1 rounded-md border p-2 focus:outline-none focus:ring focus:ring-blue-400"
      />
      <button
        @click="sendMessage"
        class="ml-2 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-blue-600 active:scale-95"
      >
        Send
      </button>
    </div>
  </div>
</template>
