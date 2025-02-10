<template>
  <div class="flex flex-col 2xl:h-screen">
    <WindowsHeader />
    <div class="flex-grow overflow-y-auto overflow-x-hidden p-2">
      <p class="mx-1 rounded-sm px-6 py-4">
        <ChatBotMessage
          v-for="(chat, index) in chatHistory"
          :key="index"
          :chat="chat"
        />
      </p>
    </div>
    <div
      class="sticky bottom-0 mb-4 items-center justify-center gap-4 py-4"
      :class="
        colorMode.value === 'dark' ? 'bg-[#13171C] text-white' : 'bg-white'
      "
    >
      <form class="flex w-full items-center gap-4 rounded-md px-2">
        <input
          placeholder="Type here..."
          class="w-full rounded-md px-2 py-1 outline-none"
          required
          :class="
            colorMode.value === 'dark'
              ? 'border border-[#3b3b3b] bg-[#13171C] text-white'
              : 'border'
          "
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

const colorMode = useColorMode()
const chatHistory = ref([...chats])
</script>
