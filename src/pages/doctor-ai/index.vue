<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #apps>
      <LayoutNavbar />
      <AppsDoctorAi
        :inputPlaceholder="'Ask doctor ai...'"
        :initialMessage="quasiAiTutor"
      />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { quasiAiTutor } from '~/prompts/chatbot'
</script>
