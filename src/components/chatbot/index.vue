<template>
  <div class="flex flex-col 2xl:h-screen">
    <div
      ref="chatBodyRef"
      class="flex-grow overflow-y-auto overflow-x-hidden p-2"
    >
      <p class="mx-1 rounded-sm px-6 py-4">
        <ChatBotMessage
          v-for="(chat, index) in chatHistory"
          :key="index"
          :chat="chat"
        />
      </p>
    </div>
    <div
      class="sticky bottom-0 mb-2 items-center justify-center gap-4 bg-white p-4 dark:bg-[#111C44] dark:text-white"
    >
      <form class="flex w-full items-center gap-4 rounded-md px-2">
        <input
          placeholder="Type here..."
          class="w-full rounded-md bg-white p-4 px-2 py-1 outline-none dark:bg-[#111C44] dark:text-white"
          required
        />
        <button type="submit">
          <sendMsgIcon />
        </button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { chats } from '~/constants/chats'
import sendMsgIcon from '@/assets/icons/send-msg.vue'
import ChatBotMessage from './messages.vue'

const chatHistory = ref([...chats])
</script>
