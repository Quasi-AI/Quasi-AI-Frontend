<template>
  <div
    class="flex h-full flex-col gap-4 overflow-y-auto py-4"
    :class="colorMode.value === 'dark' ? 'text-white' : ''"
  >
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
  {
    label: 'Learning Games',
    route: '/learning-games',
    icon: AcademicCapIcon
  },
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

const isActive = (routePath: string) => route.fullPath.startsWith(routePath)
</script>
