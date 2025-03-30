<template>
  <div class="mt-20"></div>
  <div
    class="fixed bottom-0 left-0 flex w-full bg-white py-2 shadow-lg lg:hidden dark:bg-[#111C44]"
  >
    <div class="grid w-full grid-cols-5">
      <NuxtLink
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.route"
        class="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300"
        :class="{ 'text-[#5D3BEA]': isActive(item.route) }"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="text-xs">{{ item.mobileLabel }}</span>
      </NuxtLink>

      <!-- Plan -->
      <NuxtLink
        to="/other/pricing/plan"
        class="flex flex-col items-center text-gray-600 dark:text-gray-300"
      >
        <SparklesIcon class="h-6 w-6" />
        <span class="text-xs">Plan</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {
  Squares2X2Icon,
  CubeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const menuItems = [
  {
    fullLabel: 'Dashboard',
    mobileLabel: 'Dashboard',
    route: '/dashboard',
    icon: Squares2X2Icon
  },
  { fullLabel: 'Apps', mobileLabel: 'Apps', route: '/apps', icon: CubeIcon },
  {
    fullLabel: 'Games',
    mobileLabel: 'Games',
    route: '/other/games',
    icon: AcademicCapIcon
  },
  {
    fullLabel: 'Past Questions',
    mobileLabel: 'Past Que.',
    route: '/other/past-questions',
    icon: DocumentTextIcon
  }
]

const isActive = path => route.fullPath.startsWith(path)
</script>
