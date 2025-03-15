<template>
  <div
    class="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-white p-5 lg:justify-end dark:bg-[#111C44] dark:text-white shadow-md"
  >
    <NuxtLink to="/" class="flex w-40 items-center gap-2 truncate lg:hidden">
      <img
        src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
        alt="logo"
        class="w-10"
      />
      <h1 class="text-2xl font-bold">QUASI AI</h1>
    </NuxtLink>

    <div class="flex items-center gap-2">
      <lightModeIcon
        v-if="!isDark"
        @click="isDark = !isDark"
        class="cursor-pointer"
      />
      <DarkModeIcon
        v-if="isDark"
        @click="isDark = !isDark"
        class="cursor-pointer"
      />

      <div class="flex items-center gap-2">
        <UDropdown
          mode="click"
          :popper="{ placement: 'right-start', arrow: true }"
          :items="profileList"
          class="w-fit dark:bg-[#111C44] dark:text-white"
        >
          <div class="flex items-center gap-2">
            <CommonProfileImage
              :img-src="userInfo?.profileImage"
              :name="userInfo?.name"
              :scale="true"
              baseClass="w-[30px] h-[30px]"
              :class="[isUserRoute ? 'rounded-full ring-2 ring-blue-500' : '']"
            />
            <ArrowDownLeftIcon class="h-5 w-5 cursor-pointer text-gray-500" />
          </div>
        </UDropdown>
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
  QuestionMarkCircleIcon
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
    mobileLabel: 'Questions',
    route: '/other/past-questions',
    icon: DocumentTextIcon
  }
]

const isActive = path => route.fullPath.startsWith(path)
</script>
