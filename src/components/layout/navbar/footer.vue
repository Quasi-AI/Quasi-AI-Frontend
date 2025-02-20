<template>
  <div
    class="flex flex-col items-center py-4 text-xs"
    :class="colorMode.value === 'dark' ? 'text-gray-300' : 'text-gray-600'"
  >
    <h1 class="truncate">Quasi AI</h1>
    <p>Copyright © {{ year }}</p>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const year = new Date().getFullYear()
</script>
