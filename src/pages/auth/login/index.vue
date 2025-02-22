<template>
  <NuxtLayout name="auth-wrapper">
    <div
      class="w-full max-w-[569px] rounded-2xl bg-white py-6 text-center text-2xl lg:shadow-md"
    >
      <NuxtLink to="/" class="flex items-center justify-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
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
          class="w-full rounded-2xl bg-[#F1F3FE]"
        />

        <div class="relative">
          <UInput
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Password"
            v-model="password"
            maxLength="250"
            size="xl"
            variant="none"
            class="w-full rounded-2xl bg-[#F1F3FE]"
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
          variant=""
          class="flex w-full items-center justify-center rounded-md bg-[#5D3BEA] text-white"
          label="Sign in"
          size="md"
          :disabled="!isValidEmail(email) || isLoading"
          @click="login"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else class="flex items-center">
            <Loader class="h-5 w-5 animate-spin" /> <!-- Spinner -->
          </span>
        </UButton>

        <NuxtLink to="/auth/forgot-password" class="text-sm text-[#5D3BEA]"
          >Forgot password</NuxtLink
        >
      </div>

      <p class="text-sm text-black">
        New to Quasi AI?
        <NuxtLink to="/auth/sign-up" class="text-[#5D3BEA]">Sign up</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useAuthenticationStore } from '~/store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const isLoading = ref(false) // <-- Add loading state
const store = useAuthenticationStore()
const router = useRouter()

const login = async () => {
  isLoading.value = true // Show loader

  try {
    await store.login(email.value, password.value) // Wait for login
    router.push('/dashboard') // Redirect to dashboard
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false // Hide loader after process
  }
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

