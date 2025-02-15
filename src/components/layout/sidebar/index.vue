<template>
  <div class="flex h-screen flex-col bg-white dark:bg-[#111C44]">
    <NuxtLink
      to="/"
      class="mb-2 hidden items-center gap-2 border-b-[0.4px] px-7 py-3 md:flex dark:border-[#3b3b3b]"
    >
      <img
        src="https://raw.githubusercontent.com/Quasi-AI/Quasi-AI-Frontend/refs/heads/develop/src/assets/quasiailogo.png"
        alt="logo"
        class="w-5 cursor-pointer"
      />
      <h1 class="text-lg font-bold">QUASI AI</h1>
    </NuxtLink>
    <div class="mx-5">
      <LayoutSidebarLists />
    </div>

    <div class="flex-grow"></div>

    <div
      class="hidden flex-col items-center py-4 text-xs md:flex"
      :class="colorMode.value === 'dark' ? 'text-gray-300' : 'text-gray-600'"
    >
      <h1 class="truncate">Quasi AI</h1>
      <p>Copyright © {{ year }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const year = new Date().getFullYear()
</script>
