<script setup lang="ts">
defineProps<{ text: string; sender: 'me' | 'other' }>()
</script>

<template>
  <div
    class="animate-fade-in rounded-md p-2"
    :class="
      sender === 'me'
        ? 'self-end bg-blue-500 text-white'
        : 'self-start bg-gray-300'
    "
  >
    {{ text }}
  </div>
</template>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
