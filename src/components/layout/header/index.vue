<template>
  <div
    class="flex items-center border-b-[0.4px] border-t-[0.4px] p-2"
    :class="colorMode.value === 'dark' ? 'border-[#3b3b3b]' : ''"
  >
    <h1 :class="colorMode.value === 'dark' ? 'text-white' : ''">Header</h1>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script>
