<template>
  <div class="flex gap-2">
    <nav class="flex-1 pt-3">
      <ul class="space-y-2 px-4">
        <li>
          <button
            class="flex w-full items-center gap-3 rounded-lg bg-[#5D3BEA] p-3 text-white transition-all duration-300 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span class="text-sm font-medium"> + New Chat </span>
          </button>
        </li>
        <li v-for="(item, index) in allChats" :key="index">
          <NuxtLink
            :to="item.route"
            class="flex items-center gap-3 rounded-lg p-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-[#5D3BEA] dark:text-gray-300 dark:hover:bg-gray-800"
            :class="{ 'bg-[#5D3BEA] text-white': isActive(item.route) }"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span class="text-sm font-medium">{{ item.fullLabel }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <AppsChatsChatbot :inputPlaceholder="'Ask Quasi ai...'" />
  </div>
</template>

<script setup lang="ts">
import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'

const allChats = [
  {
    fullLabel: 'Dashboard',
    route: '/apps/ai-tutor/1',
    icon: ChatBubbleLeftIcon
  },
  { fullLabel: 'Apps', route: '/apps/ai-tutor/2', icon: ChatBubbleLeftIcon },
  { fullLabel: 'Games', route: '/apps/ai-tutor/3', icon: ChatBubbleLeftIcon }
]

const route = useRoute()
const isActive = (path: string) => route.fullPath.startsWith(path)
</script>
