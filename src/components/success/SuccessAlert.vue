<template>
  <div
    v-if="message"
    class="flex w-full items-center justify-center rounded-lg bg-green-100 p-3 text-sm text-green-700"
  >
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>
