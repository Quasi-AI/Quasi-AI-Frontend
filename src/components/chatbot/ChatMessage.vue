<script setup lang="ts">
defineProps<{ text: string; sender: 'me' | 'other' }>();
</script>

<template>
  <div class="p-2 rounded-md animate-fade-in"
       :class="sender === 'me' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'">
    {{ text }}
  </div>
</template>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
