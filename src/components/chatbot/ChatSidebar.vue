<script setup lang="ts">
import { useChatStore } from '@/store/chat'
import { generateString } from '@/utils/chatHelpers'

const chatStore = useChatStore()
onMounted(() => {
  const userId = sessionStorage.getItem('user_id')
  if (!chatStore.activeChatId) {
    const newId = generateString()
    chatStore.activeChatId = newId
    chatStore.chats.unshift({ key: newId, title: `New Chat: ${newId}` })
  }
  chatStore.fetchChatHistory(userId || '67d44066755edb9aac99871a')
})
</script>

<template>
  <div class="animate-slide-in-left h-full w-64 bg-gray-100 p-4 shadow-lg">
    <h2 class="mb-2 text-lg font-bold">Chats</h2>
    <ul>
      <li
        v-for="chat in chatStore.chats"
        :key="chat.key"
        @click="chatStore.setActiveChat(chat.key)"
        class="transform cursor-pointer rounded-lg p-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-200"
        :class="chatStore.activeChatId == chat.key ? 'bg-gray-200' : ''"
      >
        {{ chat.title }}
      </li>
    </ul>
  </div>
</template>

<style>
@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out;
}
</style>
