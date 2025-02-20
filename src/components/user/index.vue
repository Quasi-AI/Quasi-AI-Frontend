<template>
  <div class="container mx-auto my-10 w-full">
    <template v-if="isLoggedIn">
      <div
        class="item-center mx-8 flex flex-col gap-6 rounded-2xl bg-white p-4 lg:flex-row lg:items-start dark:bg-[#111C44]"
      >
        <div>
          <UserMe class="w-full" />
        </div>

        <div class="w-full flex-1">
          <UTabs :items="tabItems" class="my-5 rounded-2xl p-4">
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
