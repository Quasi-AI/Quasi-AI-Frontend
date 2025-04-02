<script setup lang="ts">
import ChatSidebar from '@/components/chatbot/ChatSidebar.vue'
import ChatWindow from '@/components/chatbot/ChatWindow.vue'
</script>

<template>
  <div class="flex h-screen">
    <ChatSidebar />
    <div class="flex-1 bg-gray-50">
      <ChatWindow />
    </div>
  </div>
</template>
