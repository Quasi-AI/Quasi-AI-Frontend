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
      <p class="mb-6 text-sm text-gray-500">
        Please login to continue your account
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
            class="absolute left-3 bg-white px-1 text-sm text-gray-500 transition-all"
            :class="
              email
                ? 'top-0 text-xs text-purple-600'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
            "
          >
            Email
          </label>
        </div>

        <!-- Password Field -->
        <div class="relative mb-4 w-full">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            id="password"
            class="peer w-full rounded border border-gray-300 p-3 placeholder-transparent focus:border-purple-500 focus:ring-0"
            placeholder="Password"
          />
          <label
            for="password"
            class="absolute left-3 bg-white px-1 text-sm text-gray-500 transition-all"
            :class="
              password
                ? 'top-0 text-xs text-purple-600'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
            "
          >
            Password
          </label>
          <span
            class="absolute inset-y-0 right-3 flex cursor-pointer items-center"
            @click="togglePasswordVisibility"
          >
            <UIcon
              :name="
                isPasswordVisible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'
              "
              class="text-gray-500"
            ></UIcon>
          </span>
        </div>

        <div class="mb-3 flex items-center justify-between">
          <!-- Left: Remember Me -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="remember"
              v-model="remember"
              @change="toggleRemember"
              class="mr-2"
            />
            <label for="remember" class="text-gray-600">Remember me</label>
          </div>

          <!-- Right: Forgot Password -->
          <NuxtLink to="/auth/forgot-password" class="text-sm text-[#5D3BEA]">
            Forgot password
          </NuxtLink>
        </div>

        <p v-if="passwordError" class="text-sm text-red-500">
          {{ passwordError }}
        </p>
        <UButton
          class="mb-4 w-full items-center justify-center rounded bg-[#5D3BEA] p-3 text-white"
          size="md"
          :disabled="isLoading || !isValidForm"
          @click="login"
          variant="none"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else class="flex items-center">
            <CommonLoader class="h-5 w-5 animate-spin" />
          </span>
        </UButton>
        <div class="mb-4 flex items-center justify-center">
          <div class="mt-5 flex flex-row items-center justify-center gap-4">
            <OrSeperator class="mx-2 text-gray-500" />
          </div>
        </div>
        <UButton
          class="mb-3 flex w-full items-center justify-center gap-2 rounded border p-3"
          size="md"
          @click="signInWithGoogle"
          variant="none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            class="h-5 w-5 fill-blue-600"
          >
            <path
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          Sign in as student / educator
        </UButton>
      </form>

      <p class="text-sm text-black">
        New to Quasi AI?
        <NuxtLink to="/auth/sign-up" class="text-[#5D3BEA]">Sign up</NuxtLink>
      </p>
    </div>

    <div class="m-4 w-1/2 overflow-hidden rounded-2xl bg-gray-100 md:block">
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
import OrSeperator from '@/assets/icons/svgs/or-seperator.vue'
import { auth, provider, signInWithPopup } from '~/utils/firebase'
import axios from 'axios'
import { isValidEmail } from '@/utils/isValidEmail'

const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const isLoading = ref(false)
const store = useAuthenticationStore()
const router = useRouter()
const errorMessage = ref('')

const remember = ref(false)

// Load remember state from sessionStorage
onMounted(() => {
  remember.value = sessionStorage.getItem('remember') === 'true'
})

// Watch for changes and save to sessionStorage
const toggleRemember = () => {
  sessionStorage.setItem('remember', remember.value)
}

const isValidForm = computed(() => {
  return email.value && isValidEmail(email.value) && password.value
})

const login = async () => {
  isLoading.value = true // Show loader

  try {
    await store.login(email.value, password.value, remember.value) // Wait for login
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

const signInWithGoogle = async () => {
  let result = await signInWithPopup(auth, provider)
  const userData = {
    name: result.user.displayName,
    email: result.user.email,
    uid: result.user.uid,
    photo: result.user.photoURL
  }
  try {
    let response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/google/signin',
      userData
    )

    if (response.data && response.data.token) {
      sessionStorage.setItem('authToken', response.data.token)
      sessionStorage.setItem('name', response.data.name)
      sessionStorage.setItem('email', response.data.email)
      sessionStorage.setItem('user_id', result.user.uid)
      router.push('/dashboard')
    }
  } catch (error) {
    if (error.response) {
      // Extract error message from server response
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An unexpected error occurred!'
    }
  }
}
</script>

<style scoped>
/* Hide element on small screens (mobile) */
@media (max-width: 768px) {
  .md\:block {
    display: none !important;
  }
}
</style>
