<template>
  <div
    class="fixed left-0 top-0 hidden h-screen w-64 flex-col justify-between bg-white shadow-md md:flex dark:bg-[#111C44]"
  >
    <!-- Logo Section -->
    <div class="p-5">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="logo"
          class="w-8"
        />
        <span class="font-semibold text-gray-800 dark:text-white"
          >QUASI AI</span
        >
      </NuxtLink>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1">
      <ul class="space-y-2 px-4">
        <li v-for="(item, index) in menuItems" :key="index">
          <NuxtLink
            :to="item.route"
            class="flex items-center gap-3 rounded-lg p-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-[#5D3BEA] dark:text-gray-300 dark:hover:bg-gray-800"
            :class="{ 'bg-[#5D3BEA] text-white': isActive(item.route) }"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span class="text-sm font-medium">{{ item.fullLabel }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Footer Section -->
    <div class="space-y-2 px-4 pb-4">
      <!-- Dark Mode Toggle -->
      <button
        class="flex w-full items-center gap-3 p-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-[#5D3BEA] dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <MoonIcon class="h-5 w-5" />
        <span class="text-sm">Dark Mode</span>
      </button>

      <!-- Contact Support -->
      <button
        class="flex w-full items-center gap-3 p-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-[#5D3BEA] dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <QuestionMarkCircleIcon class="h-5 w-5" />
        <span class="text-sm">Contact Support</span>
      </button>

      <!-- User Profile -->
      <div
        class="mt-4 flex items-center gap-3 rounded-lg bg-gray-100 p-3 dark:bg-[#0C1438]"
      >
        <img
          src="https://randomuser.me/api/portraits/women/50.jpg"
          alt="User"
          class="h-10 w-10 rounded-full"
        />
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-white">
            Philomena
          </h4>
          <p class="text-xs text-gray-500">rexton@gmail.com</p>
        </div>
        <ArrowRightOnRectangleIcon
          class="h-5 w-5 cursor-pointer text-gray-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Squares2X2Icon,
  CubeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const menuItems = [
  { fullLabel: 'Dashboard', route: '/dashboard', icon: Squares2X2Icon },
  { fullLabel: 'Apps', route: '/apps', icon: CubeIcon },
  { fullLabel: 'Games', route: '/games', icon: AcademicCapIcon },
  {
    fullLabel: 'Past Questions',
    route: '/past-questions',
    icon: DocumentTextIcon
  }
]

const isActive = path => route.fullPath.startsWith(path)
</script>
