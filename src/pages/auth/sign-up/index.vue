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
          label="Sign up with email"
          size="md"
          :disabled="!isValidEmail(email)"
          @click="signup"
        />
      </div>
      <p class="text-sm text-black">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-[#5D3BEA]">Sign in</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { isValidEmail } from '@/utils/isValidEmail'

const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)

const signup = () => {
  console.log('signup with:', email.value)
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
