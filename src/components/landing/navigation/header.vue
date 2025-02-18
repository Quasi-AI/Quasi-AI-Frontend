<template>
  <div class="flex items-center justify-between bg-white px-8 py-2">
    <NuxtLink to="/" class="flex items-center justify-center gap-2">
      <img
        src="https://raw.githubusercontent.com/Quasi-AI/Quasi-AI-Frontend/refs/heads/develop/src/assets/quasiailogo.png"
        alt="logo"
        class="w-10 cursor-pointer"
      />
      <h1 class="text-2xl font-bold">QUASI AI</h1>
    </NuxtLink>

    <Menu as="div" class="relative inline-block text-left">
      <MenuButton class="px-4 py-2 text-gray-700 focus:outline-none lg:hidden">
        ☰
      </MenuButton>

      <transition
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
              Features
            </p>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <p
              :class="[active ? 'bg-gray-100' : '', 'px-4 py-2']"
              class="cursor-pointer"
            >
              How it works
            </p>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <p
              :class="[active ? 'bg-gray-100' : '', 'px-4 py-2']"
              class="cursor-pointer"
            >
              Pricing
            </p>
          </MenuItem>
          <MenuItem v-slot="{ active }" class="flex justify-center border-t">
            <NuxtLink
              to="/auth/login"
              :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2']"
            >
              <p
                :class="[active ? 'bg-gray-100' : '', 'px-4 py-2']"
                class="cursor-pointer text-[#5D3BEA]"
              >
                Get Started
              </p>
            </NuxtLink>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>

    <ul class="hidden flex-row items-center gap-4 lg:flex">
      <li>Features</li>
      <li>How it works</li>
      <li>Pricing</li>
      <NuxtLink to="/auth/login">
        <UButton variant="" class="rounded-2xl bg-[#5D3BEA] text-white"
          >Get Started</UButton>
      </NuxtLink>
    </ul>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
</script>
