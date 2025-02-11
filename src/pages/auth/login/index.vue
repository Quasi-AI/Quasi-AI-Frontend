<template>
  <NuxtLayout name="auth-wrapper">
    <div
      class="w-full max-w-[569px] rounded-2xl bg-white py-6 text-center text-2xl lg:shadow-md"
    >
      <NuxtLink to="/" class="flex items-center justify-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/Quasi-AI-Frontend/refs/heads/develop/src/assets/icons/quasiailogo.png"
          alt="logo"
          class="w-10 cursor-pointer"
        />
        <h1 class="text-2xl font-bold">QUASI AI</h1>
      </NuxtLink>

      <div class="mx-8 flex items-center justify-center gap-4 py-4">
        <GoogleLogo class="cursor-pointer" />
        <FacebookLogo class="cursor-pointer" />
      </div>

      <div class="flex flex-row items-center justify-center gap-4">
        <OrSeperator class="w-3/4 sm:w-2/3" />
      </div>

      <div class="mx-8 flex flex-col gap-4 py-6 sm:mx-12">
        <UInput
          v-model="email"
          type="email"
          placeholder="Enter email"
          maxLength="250"
          size="xl"
          variant="none"
          class="w-full border-b border-[#5D3BEA] bg-white"
        />

        <div class="relative">
          <UInput
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Password"
            v-model="password"
            maxLength="250"
            size="xl"
            variant="none"
            class="w-full border-b border-[#5D3BEA] bg-white"
          />
          <span
            class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
            @click="togglePasswordVisibility"
          >
            <UIcon
              :name="
                isPasswordVisible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'
              "
            ></UIcon>
          </span>
        </div>

        <UButton
          class="flex w-full justify-center bg-[#5D3BEA] font-bold text-white"
          variant="none"
          label="Sign in"
          size="md"
          :disabled="!isValidEmail(email)"
          @click="login"
        />
      </div>
      <p class="text-sm text-black">
        New to Quasi AI?
        <NuxtLink to="/auth/sign-up" class="text-[#5D3BEA]">Sign up</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import OrSeperator from '@/assets/media/svgs/or-seperator.vue'
import GoogleLogo from '@/assets/media/svgs/signin-google.vue'
import FacebookLogo from '@/assets/media/svgs/signin-facebook.vue'
import { isValidEmail } from '@/utils/isValidEmail'

const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)

const login = () => {
  console.log('Login with:', email.value)
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
