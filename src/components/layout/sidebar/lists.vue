<template>
  <div
    class="fixed left-0 top-0 z-50 w-full"
    :class="colorMode.value === 'dark' ? 'text-white' : ''"
  >
    <!-- Bottom Navigation (Mobile) -->
    <div
      class="flex w-full items-center justify-between overflow-hidden bg-white px-2 py-4 sm:overflow-x-auto sm:whitespace-nowrap dark:bg-[#111C44]"
    >
      <div class="flex shrink-0 items-center px-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 truncate text-sm font-medium transition-colors duration-200"
        >
          <img
            src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
            alt="logo"
            class="w-8 cursor-pointer"
          />
          <span>QUASI AI</span>
        </NuxtLink>
      </div>

      <div class="flex gap-4 overflow-x-auto whitespace-nowrap">
        <router-link
          v-for="(item, index) in mainItemsMobile"
          :key="index"
          :to="item.route"
          class="flex shrink-0 flex-col items-center truncate text-xs transition-colors duration-200"
          :class="{
            'font-medium text-[#5D3BEA]': isActive(item.route),
            'text-gray-500 hover:text-[#5D3BEA]': !isActive(item.route)
          }"
        >
          <component :is="item.icon" class="h-6 w-6" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  LightBulbIcon,
  ArchiveBoxIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'

const colorMode = useColorMode()
const route = useRoute()

const mainItemsMobile = [
  { label: 'Dashboard', route: '/dashboard', icon: HomeIcon },
  { label: 'Games', route: '/learning-games', icon: AcademicCapIcon },
  {
    label: 'Doctor AI',
    route: '/doctor-ai?type=doctor-ai',
    icon: UserGroupIcon
  },
  {
    label: 'Tutor',
    route: '/smart-tutoring?type=smart-tutoring',
    icon: LightBulbIcon
  },
  {
    label: 'Past Questions',
    route: '/past-questions?type=past-questions',
    icon: ArchiveBoxIcon
  },
  { label: 'Plan', route: '/plan', icon: ClipboardDocumentCheckIcon }
]

const isActive = (routePath: string) => route.fullPath.startsWith(routePath)
</script>
