<template>
  <div
    class="z-50 flex items-center justify-between bg-[#E4E0F4] p-4 xl:mx-auto 2xl:w-[1440px]"
  >
    <NuxtLink to="/" class="flex items-center justify-center gap-2">
      <img
        src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
        alt="logo"
        class="w-10 cursor-pointer"
      />
      <h1 class="text-2xl font-bold">QUASI AI</h1>
    </NuxtLink>

    <div class="hidden flex-row items-center gap-4 lg:flex">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/">Why us</NuxtLink>
      <NuxtLink to="/">Features</NuxtLink>
    </div>

    <div class="flex items-center gap-2">
      <div
        v-if="!isLoggedIn"
        class="hidden flex-row items-center gap-4 lg:flex"
      >
        <NuxtLink
          to="/auth/login"
          class="text-blue hidden rounded-lg bg-white px-6 py-1 transition duration-300 hover:scale-105 lg:block dark:bg-[#111C44] dark:text-white"
        >
          Login
        </NuxtLink>
        <NuxtLink
          to="/auth/sign-up"
          class="hidden rounded-lg bg-[#5D3BEA] px-6 py-1 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA] lg:block"
        >
          Sign up
        </NuxtLink>
      </div>

      <Menu as="div" class="relative block text-left lg:hidden">
        <MenuButton
          class="z-50 px-4 py-2 text-gray-700 focus:outline-none lg:hidden"
        >
          ☰
        </MenuButton>

        <transition
          class="z-50"
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 mt-2 w-48 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none lg:hidden"
          >
            <MenuItem v-slot="{ active }">
              <p
                :class="[active ? 'bg-gray-100' : '', 'px-4 py-2']"
                class="cursor-pointer"
              >
                Home
              </p>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <p
                :class="[active ? 'bg-gray-100' : '', 'px-4 py-2']"
                class="cursor-pointer"
              >
                Why us
              </p>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <p
                :class="[active ? 'bg-gray-100' : '', 'px-4 py-2']"
                class="cursor-pointer"
              >
                Features
              </p>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>

      <NuxtLink to="/user" v-if="isLoggedIn" class="flex items-center gap-2">
        <CommonProfileImage
          :img-src="userInfo?.profileImage"
          :name="userInfo?.name"
          :scale="true"
          baseClass="w-[30px] h-[30px]"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUser } from '~/composables/useUser'
import { useAuth } from '~/composables/useAuth'

const { userInfo } = useUser()
const { isLoggedIn } = useAuth()
const route = useRoute()
</script>
