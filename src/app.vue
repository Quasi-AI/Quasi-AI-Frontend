<template>
  <NuxtPage />
  <UNotifications />
</template>

<script setup lang="ts">
import { useNotificationWatcher } from '@/composables/useNotificationWatcher'

useNotificationWatcher()
</script>
