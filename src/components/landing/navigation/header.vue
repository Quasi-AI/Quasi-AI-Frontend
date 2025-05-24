<template>
  <div class="sticky top-0 z-50 w-full" :class="bgClass">
    <div
      class="flex items-center justify-between p-4 xl:mx-auto 2xl:w-[1440px]"
    >
      <NuxtLink
        to="/"
        class="flex items-center justify-center gap-2 transition duration-300 hover:opacity-90"
      >
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="logo"
          class="w-8 cursor-pointer"
        />
        <h1 class="text-xl font-bold dark:text-white sm:text-2xl">QUASI AI</h1>
      </NuxtLink>

      <div class="hidden flex-row items-center gap-6 lg:flex">
        <NuxtLink
          to="/#home"
          class="transition duration-300 hover:text-[#5D3BEA] dark:text-white"
          >Home</NuxtLink
        >
        <NuxtLink
          to="/#why"
          class="transition duration-300 hover:text-[#5D3BEA] dark:text-white"
          >Why us</NuxtLink
        >
        <NuxtLink
          to="/#features"
          class="transition duration-300 hover:text-[#5D3BEA] dark:text-white"
          >Features
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <div
          v-if="!isLoggedIn"
          class="hidden flex-row items-center gap-4 lg:flex"
        >
          <NuxtLink
            to="/auth/login"
            class="rounded-lg bg-white px-6 py-2 text-[#5D3BEA] transition duration-300 hover:bg-opacity-90 dark:bg-[#111C44] dark:text-white"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/auth/sign-up"
            class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:bg-[#4A2DCA]"
          >
            Sign up
          </NuxtLink>
        </div>

        <!-- Add dark mode toggle -->
        <div class="mr-4 cursor-pointer">
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
        </div>

        <Menu as="div" class="relative block text-left lg:hidden">
          <MenuButton class="rounded-lg p-2 focus:outline-none">
            <span class="text-2xl dark:text-white">☰</span>
          </MenuButton>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#111C44]"
            >
              <MenuItem v-slot="{ active }">
                <NuxtLink
                  to="/#home"
                  :class="[
                    active ? 'bg-gray-100 dark:bg-[#1E293B]' : '',
                    'block px-4 py-2 text-sm transition duration-300 hover:text-[#5D3BEA] dark:text-white'
                  ]"
                >
                  Home
                </NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <NuxtLink
                  to="/#why"
                  :class="[
                    active ? 'bg-gray-100 dark:bg-[#1E293B]' : '',
                    'block px-4 py-2 text-sm transition duration-300 hover:text-[#5D3BEA] dark:text-white'
                  ]"
                >
                  Why us
                </NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <NuxtLink
                  to="/#features"
                  :class="[
                    active ? 'bg-gray-100 dark:bg-[#1E293B]' : '',
                    'block px-4 py-2 text-sm transition duration-300 hover:text-[#5D3BEA] dark:text-white'
                  ]"
                >
                  Features
                </NuxtLink>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>

        <NuxtLink
          to="/dashboard"
          v-if="isLoggedIn"
          class="flex items-center gap-2"
        >
          <CommonProfileImage
            :img-src="userInfo?.profileImage"
            :name="userInfo?.name"
            :scale="true"
            baseClass="w-[35px] h-[35px] rounded-full"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUser } from '~/composables/useUser'
import { useAuth } from '~/composables/useAuth'
import lightModeIcon from '@/assets/icons/light-mode.vue'
import DarkModeIcon from '@/assets/icons/dark-mode.vue'

const { userInfo } = useUser()
const { isLoggedIn } = useAuth()

const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () =>
    (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark')
})

// Update bgClass to handle dark mode
const bgClass = ref('bg-[#E4E0F4] dark:bg-[#1E2A5A]')

const handleScroll = () => {
  if (window.scrollY > window.innerHeight * 0.6) {
    bgClass.value = 'bg-white dark:bg-[#111C44]'
  } else {
    bgClass.value = 'bg-[#E4E0F4] dark:bg-[#1E2A5A]'
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.3s ease-in-out;
}
</style>
