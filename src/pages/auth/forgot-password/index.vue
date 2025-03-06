<template>
  <div class="flex h-screen">
    <div
      class="flex h-full w-full flex-col items-center justify-center bg-white px-10 md:w-1/2"
    >
      <NuxtLink to="/" class="mb-4 flex items-center justify-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="QUASI AI Logo"
          class="h-10 cursor-pointer"
        />
        <h1 class="text-2xl font-bold">QUASI AI</h1>
      </NuxtLink>
      <p class="mb-6 text-center text-gray-500">
        We will send you reset instruction in your email
      </p>

      <form class="w-full max-w-sm">
        <!-- Email Field -->
        <div class="relative mb-4 w-full">
          <input
            v-model="email"
            type="email"
            id="email"
            class="peer w-full rounded border border-gray-300 p-3 placeholder-transparent focus:border-purple-500 focus:ring-0"
            placeholder="Email"
          />
          <label
            for="email"
            class="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-purple-600"
          >
            Email
          </label>
        </div>
        <UButton
          class="mb-4 w-full items-center justify-center rounded bg-[#5D3BEA] p-3 text-white"
          size="md"
          :disabled="isLoading || !isValidForm"
          @click="forgotPassword"
          variant="none"
        >
          <span v-if="!isLoading">Send reset instructions</span>
          <span v-else class="flex items-center">
            <Loader class="h-5 w-5 animate-spin" />
          </span>
        </UButton>
      </form>

      <p class="text-sm text-black">
        Remember password?
        <NuxtLink to="/auth/login" class="text-[#5D3BEA]">Login</NuxtLink>
      </p>
    </div>

    <div
      class="m-4 hidden w-1/2 overflow-hidden rounded-2xl bg-gray-100 md:block"
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/park4me-b2127.appspot.com/o/freepik__the-style-is-candid-image-photography-with-natural__28525.png?alt=media&token=8a662acd-7725-41cb-9601-785985db76b9"
        alt="cover"
        class="h-full w-full rounded-2xl object-cover"
      />
    </div>
  </div>
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

const isValidForm = computed(() => {
  return email.value && isValidEmail(email.value)
})
</script>
