<script setup lang="ts">
import { useChatStore } from '@/store/chat'
import { generateString } from '@/utils/chatHelpers'

const chatStore = useChatStore()

const createNewChat = () => {
  const newId = generateString()
  chatStore.chats.unshift({ key: newId, title: `New Chat: ${newId}` })
  chatStore.setActiveChat(newId)
  chatStore.clearMessages()
}

const deleteChat = (chatKey: string, event: Event) => {
  event.stopPropagation()
  chatStore.deleteChat(chatKey)

  // If there are no chats left after deletion, create a new one
  if (chatStore.chats.length === 0) {
    createNewChat()
  }
}

onMounted(() => {
  const userId = sessionStorage.getItem('user_id')
  if (!chatStore.activeChatId) {
    const newId = generateString()
    chatStore.activeChatId = newId
    chatStore.chats.unshift({ key: newId, title: `New Chat: ${newId}` })
  }
  if (userId) {
    chatStore.fetchChatHistory(userId)
  }
})
</script>

<template>
  <div
    class="animate-slide-in-left fixed left-0 top-0 z-20 h-screen w-64 overflow-y-auto bg-gray-100 p-4 shadow-lg dark:bg-[#111C44] dark:text-white"
  >
    <!-- Logo Section -->
    <div class="p-5">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="logo"
          class="w-10"
        />
        <h1 class="text-2xl font-bold">QUASI AI</h1>
      </NuxtLink>
    </div>

    <div class="mb-4">
      <button
        @click="createNewChat"
        class="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-[#5D3BEA] dark:hover:bg-[#4A2DCA]"
      >
        New Chat
      </button>
    </div>
    <ul>
      <li
        v-for="chat in chatStore.chats"
        :key="chat.key"
        class="flex transform cursor-pointer items-center justify-between rounded-lg p-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-200 hover:dark:bg-[#1E2A5A]"
        :class="
          chatStore.activeChatId == chat.key
            ? 'bg-gray-200 dark:bg-[#1E2A5A]'
            : ''
        "
      >
        <div @click="chatStore.setActiveChat(chat.key)" class="flex-1 truncate">
          {{ chat.title }}
        </div>
        <button
          @click="deleteChat(chat.key, $event)"
          class="ml-2 rounded-full p-1 text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          title="Delete chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
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
