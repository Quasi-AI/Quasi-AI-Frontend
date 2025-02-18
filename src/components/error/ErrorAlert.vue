<template>
    <div v-if="message" class="flex w-full justify-center rounded-md bg-red-100 p-3 text-red-700 text-sm">
    {{ message }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: String,
  })
  </script>
  
  