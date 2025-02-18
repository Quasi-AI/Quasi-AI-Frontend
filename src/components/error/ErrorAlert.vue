<template>
  <div
    v-if="message"
    class="flex w-full items-center justify-center rounded-lg bg-red-100 p-3 text-sm text-red-700"
  >
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>
