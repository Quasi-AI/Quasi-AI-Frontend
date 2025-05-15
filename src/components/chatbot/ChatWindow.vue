<script setup lang="ts">
import { ref, watchEffect, nextTick } from 'vue'
import { useChatStore } from '@/store/chat'

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
  <div class="flex h-full w-full flex-col p-4 lg:pl-64">
    <!-- Chat Messages -->
    <div class="chat-container flex-1 space-y-2 overflow-auto">
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
    </div>

    <!-- Message Input -->
    <div
      class="fixed bottom-16 right-0 flex w-full items-center border-t bg-white p-4 dark:bg-[#111C44] lg:bottom-4 lg:pl-64 lg:pr-4"
    >
      <div class="mx-auto flex w-full max-w-3xl items-center gap-2">
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
  </div>
</template>
