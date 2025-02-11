<template>
  <div
    class="flex flex-col items-center justify-between bg-[#a4d3ff] px-8 py-6 lg:flex-row"
  >
    <NuxtLink to="/" class="flex items-center justify-center gap-2">
      <img :src="QuasiLogo" alt="logo" class="w-10 cursor-pointer" />
      <h1 class="text-2xl font-bold">QUASI AI</h1>
    </NuxtLink>

    <ul class="flex flex-col gap-4 space-x-2 lg:flex-row lg:gap-0">
      <div class="flex space-x-2">
        <OkSocial />
        <VkSocial />
        <TelegramSocial />
        <FacebookSocial />
        <Instagram />
      </div>

      <div>
        <p class="pl-6 text-center text-sm lg:text-left">
          © 2025 - Copyright <br />All rights reserved
        </p>
      </div>
    </ul>
  </div>
</template>

<script setup>
import FacebookSocial from '~/assets/media/svgs/social/facebook-social.vue'
import Instagram from '~/assets/media/svgs/social/instagram.vue'
import OkSocial from '~/assets/media/svgs/social/ok-social.vue'
import VkSocial from '~/assets/media/svgs/social/vk-social.vue'
import TelegramSocial from '~/assets/media/svgs/social/telegram-social.vue'
import QuasiLogo from '@/assets/icons/quasiailogo.png'
</script>
