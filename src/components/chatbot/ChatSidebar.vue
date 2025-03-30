<script setup lang="ts">
import { useChatStore } from '@/store/chat';
import {generateString} from '@/utils/chatHelpers'

const chatStore = useChatStore();
onMounted(()=> {
    const userId = sessionStorage.getItem('user_id')
    if(!chatStore.activeChatId){
      const newId = generateString();
      chatStore.activeChatId = newId;
      chatStore.chats.unshift({key: newId, title: `New Chat: ${newId}`})
    }
    chatStore.fetchChatHistory(userId || "67d44066755edb9aac99871a")
})
</script>

<template>
  <div class="w-64 bg-gray-100 p-4 shadow-lg h-full animate-slide-in-left">
    <h2 class="text-lg font-bold mb-2">Chats</h2>
    <ul>
      <li v-for="chat in chatStore.chats" :key="chat.key"
          @click="chatStore.setActiveChat(chat.key)"
          class="p-2 cursor-pointer hover:bg-gray-200 transition-transform duration-200 ease-in-out transform hover:scale-105 rounded-lg" 
          :class="chatStore.activeChatId == chat.key ? 'bg-gray-200': ''">
        {{ chat.title }}
      </li>
    </ul>
  </div>
</template>

<style>
@keyframes slide-in-left {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out;
}
</style>
