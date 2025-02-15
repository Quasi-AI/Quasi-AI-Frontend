<template>
  <div
    class="flex flex-col gap-4 overflow-y-auto py-4 lg:h-full lg:py-0"
    :class="colorMode.value === 'dark' ? 'text-white' : ''"
  >
    <!-- Sidebar (Desktop) -->
    <div class="hidden flex-col gap-4 md:flex lg:flex">
      <router-link
        v-for="(item, index) in mainItems"
        :key="index"
        :to="item.route"
        class="flex min-w-fit cursor-pointer items-center gap-4 px-2 transition-colors duration-200"
        :class="{
          'font-medium text-[#5D3BEA]': isActive(item.route),
          'text-gray-500 hover:text-[#5D3BEA]': !isActive(item.route)
        }"
      >
        <component :is="item.icon" class="h-5 w-5" />
        {{ item.label }}
      </router-link>
    </div>

    <!-- Bottom Navigation (Mobile) -->
    <div
      class="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around bg-white p-2 shadow-md md:hidden lg:hidden dark:bg-[#111C44]"
    >
      <router-link
        v-for="(item, index) in mainItemsMobile"
        :key="index"
        :to="item.route"
        class="flex flex-col items-center truncate text-xs transition-colors duration-200"
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

const mainItems = [
  { label: 'Dashboard', route: '/dashboard', icon: HomeIcon },
  { label: 'Learning Games', route: '/learning-games', icon: AcademicCapIcon },
  {
    label: 'Doctor AI',
    route: '/doctor-ai?type=doctor-ai',
    icon: UserGroupIcon
  },
  {
    label: 'Smart Tutoring',
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
    label: 'Past Que.',
    route: '/past-questions?type=past-questions',
    icon: ArchiveBoxIcon
  },
  { label: 'Plan', route: '/plan', icon: ClipboardDocumentCheckIcon }
]

const isActive = (routePath: string) => route.fullPath.startsWith(routePath)
</script>
