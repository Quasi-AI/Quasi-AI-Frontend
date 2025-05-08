<template>
  <div
    class="fixed left-0 top-0 z-20 hidden h-screen flex-col justify-between bg-white shadow-sm md:flex dark:bg-[#111C44]"
    :class="[sidebarStore.isCollapsed ? 'w-24' : 'w-64']"
  >
    <!-- Logo Section -->
    <div
      class="p-5"
      :class="{ 'flex justify-center': sidebarStore.isCollapsed }"
    >
      <NuxtLink to="/" class="flex items-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="logo"
          class="w-10"
        />
        <h1 v-if="!sidebarStore.isCollapsed" class="text-2xl font-bold">
          QUASI AI
        </h1>
      </NuxtLink>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 pt-3">
      <ul class="space-y-2 px-4">
        <li v-for="(item, index) in menuItems" :key="index">
          <NuxtLink
            :to="item.route"
            class="flex items-center gap-3 rounded-lg p-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-[#5D3BEA] dark:text-gray-300 dark:hover:bg-gray-800"
            :class="[
              { 'bg-[#5D3BEA] text-white': isActive(item.route) },
              sidebarStore.isCollapsed ? 'justify-center' : ''
            ]"
          >
            <component :is="item.icon" class="h-6 w-6" />
            <span
              v-if="!sidebarStore.isCollapsed"
              class="text-sm font-medium"
              >{{ item.fullLabel }}</span
            >
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Footer Section -->
    <div class="space-y-2 px-4 pb-4">
      <!-- Contact Support -->
      <NuxtLink
        to="/other/support"
        class="flex items-center gap-3 rounded-lg p-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-[#5D3BEA] dark:text-gray-300 dark:hover:bg-gray-800"
        :class="[
          { 'bg-[#5D3BEA] text-white': isActive('/other/support') },
          sidebarStore.isCollapsed ? 'justify-center' : ''
        ]"
      >
        <QuestionMarkCircleIcon class="h-6 w-6" />
        <span v-if="!sidebarStore.isCollapsed" class="text-sm"
          >Contact Support</span
        >
      </NuxtLink>

      <!-- User Profile -->
      <div
        class="mt-4 flex items-center gap-3 rounded-lg bg-gray-100 p-3 dark:bg-[#0C1438]"
        :class="{ 'justify-center': sidebarStore.isCollapsed }"
      >
        <CommonProfileImage
          :img-src="userInfo?.profileImage"
          :name="userInfo?.name"
          :scale="true"
          :baseClass="sidebarStore.isCollapsed ? 'h-10 w-10' : 'h-10 w-10'"
          :class="[isUserRoute ? 'rounded-full ring-2 ring-blue-500' : '']"
        />
        <template v-if="!sidebarStore.isCollapsed">
          <div class="w-12 flex-1 truncate">
            <h4 class="text-sm font-semibold text-gray-800 dark:text-white">
              {{ userInfo?.name }}
            </h4>
            <p class="text-xs text-gray-500">{{ userInfo?.email }}</p>
          </div>
          <ArrowRightEndOnRectangleIcon
            @click="logout"
            class="h-5 w-5 cursor-pointer text-gray-500"
          />
        </template>
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
  QuestionMarkCircleIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/solid'
import { useUser } from '~/composables/useUser'
import { useAuthenticationStore } from '@/store/auth'
import { useSidebarStore } from '@/store/sidebar'

const route = useRoute()
const { userInfo } = useUser()
const authStore = useAuthenticationStore()
const sidebarStore = useSidebarStore()
const isUserRoute = computed(() => route.path === '/user')

const logout = () => {
  authStore.logout()
}

const menuItems = [
  { fullLabel: 'Dashboard', route: '/dashboard', icon: Squares2X2Icon },
  { fullLabel: 'Apps', route: '/apps', icon: CubeIcon },
  { fullLabel: 'Games', route: '/other/games', icon: AcademicCapIcon },
  {
    fullLabel: 'Past Questions',
    route: '/other/past-questions',
    icon: DocumentTextIcon
  }
]

const isActive = path => route.fullPath.startsWith(path)
</script>
