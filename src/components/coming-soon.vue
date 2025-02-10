<template>
  <div
    class="flex h-screen items-center justify-center bg-[#F4F7FE] dark:bg-gray-900"
  >
    <div
      class="max-w-md rounded-2xl bg-white p-6 text-center shadow-lg dark:bg-gray-800"
    >
      <HeroIcon class="mx-auto h-16 w-16 text-[#5D3BEA]" />
      <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
        Coming Soon
      </h1>
      <p class="my-4 text-gray-600 dark:text-gray-400">
        We're working on something amazing. Stay tuned!
      </p>
      <NuxtLink
        to="/dashboard"
        class="mt-4 rounded-lg bg-[#5D3BEA] px-4 py-2 font-medium text-white transition hover:bg-[#4a2fba]"
      >
        Back to Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RocketLaunchIcon } from '@heroicons/vue/24/solid'

const HeroIcon = RocketLaunchIcon
</script>
