<template>
  <AppsChatbot
    :inputPlaceholder="'Ask Quasi ai...'"
    :initialMessage="quasiAiTutor"
  />
</template>

<script setup lang="ts">
import { quasiAiTutor } from '~/prompts/chatbot'
</script>
