<template>
  <div class="container mx-auto w-full">
    <template v-if="isLoggedIn">
      <div
        class="flex flex-col gap-6 rounded-2xl bg-white p-4 dark:bg-[#111C44]"
      >
        <UserMe />
        <UTabs :items="tabItems">
          <template #name>
            <UserName />
          </template>
          <template #email>
            <UserEmail />
          </template>
          <template #password>
            <UserPassword />
          </template>
        </UTabs>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { isLoggedIn } = useAuth()

const tabItems = computed(() => [
  { slot: 'name', label: 'Name' },
  { slot: 'email', label: 'Email' },
  { slot: 'password', label: 'Password' }
])
</script>
