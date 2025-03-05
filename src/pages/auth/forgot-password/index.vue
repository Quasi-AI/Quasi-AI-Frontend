<template>
  <div class="flex h-screen">
    <div class="w-full md:w-1/2 h-full flex flex-col justify-center items-center bg-white px-10">
      <NuxtLink to="/" class="mb-4 flex items-center justify-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="QUASI AI Logo"
          class="h-10 cursor-pointer"
        />
        <h1 class="text-2xl font-bold">QUASI AI</h1>
      </NuxtLink>
      <p class="text-gray-500 mb-6">We will send you reset instruction in your email</p>

      <form class="w-full max-w-sm">
        <!-- Email Field -->
        <div class="relative w-full mb-4">
          <input
            v-model="email"
            type="email"
            id="email"
            class="peer w-full p-3 border border-gray-300 rounded focus:border-purple-500 focus:ring-0 placeholder-transparent"
            placeholder="Email"
          />
          <label for="email"
            class="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-purple-600"
          >
            Email
          </label>
        </div>
        <UButton 
            class="w-full bg-[#5D3BEA] items-center justify-center text-white p-3 rounded mb-4" 
            size="md"
            :disabled="isLoading || !isValidForm"
            @click="forgotPassword"
            variant="none">
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
    
    <div class="w-1/2 bg-gray-100 rounded-2xl overflow-hidden m-4 md:block">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/park4me-b2127.appspot.com/o/freepik__the-style-is-candid-image-photography-with-natural__28525.png?alt=media&token=8a662acd-7725-41cb-9601-785985db76b9" 
        class="h-full w-full object-cover rounded-2xl"
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
