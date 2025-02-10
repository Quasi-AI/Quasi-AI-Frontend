<template>
  <div
    class="flex min-h-screen flex-col"
    :class="colorMode.value === 'dark' ? 'bg-[#111C44] text-white' : 'bg-white'"
  >
    <NuxtLink
      to="/"
      class="flex items-center gap-2 p-4"
      :class="
        colorMode.value === 'dark'
          ? 'border-b border-[#3b3b3b]'
          : 'border-b border-[#F1F3FE]'
      "
    >
      <img :src="quasiaiLogo" alt="logo" class="w-10 cursor-pointer" />
      <h1 class="text-2xl font-bold">QUASI AI</h1>
    </NuxtLink>
    <div class="mx-5">
      <SidebarLists />
    </div>

    <div class="flex-grow"></div>

    <div
      class="flex flex-col items-center py-4 text-xs"
      :class="colorMode.value === 'dark' ? 'text-gray-300' : 'text-gray-600'"
    >
      <h1 class="truncate">Quasi AI</h1>
      <p>Copyright © {{ year }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import quasiaiLogo from '@/assets/icons/quasiailogo.png'

const colorMode = useColorMode()

const year = new Date().getFullYear()
</script>
