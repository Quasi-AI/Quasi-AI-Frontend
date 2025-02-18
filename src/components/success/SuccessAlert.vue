<template>
    <div v-if="message" class="flex w-full rounded-lg bg-green-100 p-3 text-green-700 text-sm">
    {{ message }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: String,
  })
  </script>
  