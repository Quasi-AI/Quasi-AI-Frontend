<script setup lang="ts">
import { ref } from 'vue'
import ChatbotChatSidebar from '@/components/chatbot/ChatSidebar.vue'
import ChatbotChatWindow from '@/components/chatbot/ChatWindow.vue'

const showSidebar = ref(true)
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}
</script>

<template>
  <div class="flex gap-2">
    <ChatbotChatSidebar v-if="showSidebar" />
    <ChatbotChatWindow :showSidebar="showSidebar" @toggle-sidebar="toggleSidebar" />
  </div>
</template>
