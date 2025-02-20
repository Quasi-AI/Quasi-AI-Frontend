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

        <UButton
          variant=""
          class="flex w-full items-center justify-center rounded-md bg-[#5D3BEA] text-white"
          label="Sign in"
          size="md"
          :disabled="!isValidEmail(email) || isLoading"
          @click="forgotPassword"
        >
          <span v-if="!isLoading">Recover Account</span>
          <span v-else class="flex items-center">
            <Loader class="h-5 w-5" />
          </span>
        </UButton>
        <NuxtLink to="/auth/login" class="text-sm text-[#5D3BEA]"
          >Back to login</NuxtLink
        >
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useAuthenticationStore } from '~/store/auth'
import { isValidEmail } from '@/utils/isValidEmail'

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const store = useAuthenticationStore()

const forgotPassword = async () => {
  errorMessage.value = null
  successMessage.value = null
  isLoading.value = true

  if (!email.value) {
    errorMessage.value = 'Please enter your email address'
  } else if (!isValidEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address'
  } else {
    try {
      await store.forgotPassword(email.value)
      successMessage.value = 'Email sent successfully. Please check your inbox.'
    } catch (error) {
      errorMessage.value =
        error.message || 'An error occurred. Please try again.'
    }
  }

  isLoading.value = false

  setTimeout(() => {
    errorMessage.value = null
    successMessage.value = null
  }, 3000)
}
</script>
