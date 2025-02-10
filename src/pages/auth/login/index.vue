<template>
  <NuxtLayout name="auth-wrapper">
    <div
      class="w-full max-w-[569px] rounded-2xl bg-white py-6 text-center text-2xl lg:shadow-md"
    >
      <NuxtLink to="/">
        <QuasiLogo class="mx-auto w-24 sm:w-28" />
      </NuxtLink>

      <div class="mx-8 flex items-center justify-center gap-4 py-4">
        <GoogleLogo class="cursor-pointer" />
        <FacebookLogo class="cursor-pointer" />
      </div>

      <div class="flex flex-row items-center justify-center gap-4">
        <OrSeperator class="w-3/4 sm:w-2/3" />
      </div>

      <div class="mx-8 flex flex-col gap-4 py-6 sm:mx-12">
        <h1 class="text-left text-lg font-bold">Sign in with email</h1>
        <UInput
          v-model="email"
          type="email"
          placeholder="Enter email"
          maxLength="250"
          size="xl"
          class="w-full"
        />

        <div class="relative">
          <UInput
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Password"
            v-model="password"
            maxLength="250"
            size="xl"
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
          class="flex w-full justify-center font-bold"
          color="cyan"
          label="Sign in"
          variant="solid"
          size="md"
          :disabled="!isValidEmail(email)"
          @click="login"
        />
      </div>
      <p class="text-sm">
        New to Quasi AI?
        <NuxtLink to="/auth/sign-up" class="text-[#518aa7]">Sign up</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import QuasiLogo from '@/assets/media/svgs/quasiai-logo.vue'
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
