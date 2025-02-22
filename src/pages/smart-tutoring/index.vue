<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #apps>
      <LayoutNavbar />
      <AppsSmartTutoring
        :inputPlaceholder="'Ask smart tutoring...'"
        :initialMessage="quasiAiTutor"
      />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { quasiAiTutor } from '~/prompts/chatbot'
</script>
