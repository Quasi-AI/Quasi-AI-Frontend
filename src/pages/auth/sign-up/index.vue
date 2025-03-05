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
      <p class="text-gray-500 mb-6">Create account for free to enjoy QUASI AI</p>

      <form class="w-full max-w-sm">
        <!-- Fullname Field -->
        <div class="relative w-full mb-4">
          <input
            v-model="name"
            type="text"
            id="fullname"
            class="peer w-full p-3 border border-gray-300 rounded focus:border-purple-500 focus:ring-0 placeholder-transparent"
            placeholder="Fullname"
          />
          <label for="fullname"
            class="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-purple-600"
          >
            Fullname
          </label>
        </div>

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

        <!-- Password Field -->
        <div class="relative w-full mb-4">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            id="password"
            class="peer w-full p-3 border border-gray-300 rounded focus:border-purple-500 focus:ring-0 placeholder-transparent"
            placeholder="Password"
          />
          <label for="password"
            class="absolute left-3 top-1/2 -translate-y-1/2  px-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-purple-600 bg-white"
          >
            Password
          </label>
          <span
            class="absolute inset-y-0 right-3 flex items-center cursor-pointer"
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


        <p v-if="passwordError" class="text-sm text-red-500">
          {{ passwordError }}
        </p>
        <div class="flex items-center mb-3">
          <input 
            type="checkbox" 
            id="educator" 
            v-model="role" 
            true-value="Educator" 
            false-value="Student" 
            class="mr-2"
          />
          <label for="educator" class="text-gray-600">I am an educator</label>
        </div>
        <UButton 
          class="w-full bg-[#5D3BEA] items-center justify-center text-white p-3 rounded mb-4" 
          size="md"
          :disabled="isLoading || !isValidForm"
          @click="signup"
          variant="none">
          <span v-if="!isLoading">Sign Up</span>
          <span v-else class="flex items-center">
            <Loader class="h-5 w-5 animate-spin" />
          </span>
        </UButton>
        <div class="flex items-center justify-center mb-4">
          <div class="mt-5 flex flex-row items-center justify-center gap-4">
          <OrSeperator class="mx-2 text-gray-500" />
          </div>
        </div>
        <UButton class="w-full flex items-center gap-2 justify-center border p-3 rounded mb-3"
          size="md"
          @click="signUpWithGoogleAsStudent"
          variant="none">
          <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                class="h-5 w-5 fill-blue-600"
              >
                <path
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                />
              </svg> Sign up with Google as student
        </UButton>
        <UButton class="w-full flex items-center gap-1 justify-center border p-3 rounded"
          size="md"
          @click="signUpWithGoogleAsEducator"
          variant="none">
          <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                class="h-5 w-5 fill-red-600"
              >
                <path
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                />
              </svg> Sign up with Google as educator
        </UButton>

      </form>

      <p class="mt-4 text-gray-600">
        Already have an account? 
        <NuxtLink to="/auth/login" class="text-[#5D3BEA]">Sign in</NuxtLink>
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
import OrSeperator from '@/assets/media/svgs/or-seperator.vue'
import { isValidEmail } from '@/utils/isValidEmail'
import Loader from '@/components/loader/Loader.vue'
import { useAuthenticationStore } from '~/store/auth'
import axios from 'axios'
import { auth, provider, signInWithPopup } from '~/utils/firebase'

const router = useRouter() // Get router instance
const name = ref('')
const nameError = ref('')
const role = ref('Student')
const email = ref('')
const password = ref('')
const passwordError = ref('')
const isPasswordVisible = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const store = useAuthenticationStore()

const isValidForm = computed(() => {
  return (
    name.value &&
    !nameError.value &&
    email.value &&
    isValidEmail(email.value) &&
    password.value &&
    !passwordError.value
  )
})

const validateName = () => {
  const regex = /^[A-Za-z\s]+$/
  if (!regex.test(name.value)) {
    nameError.value = 'Name must only contain letters and spaces.'
  } else {
    nameError.value = ''
  }
}

const validatePassword = () => {
  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!strongPasswordRegex.test(password.value)) {
    passwordError.value =
      'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.'
  } else {
    passwordError.value = ''
  }
}

const signup = async () => {
  isLoading.value = true
  try {
    await store.signup(email.value, password.value, name.value, role.value)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const user = ref(null)

const signUpWithGoogleAsEducator = async () => {
  try {
    errorMessage.value = ''

    // Sign in with Google
    const result = await signInWithPopup(auth, provider)

    // Extract user details
    const userData = {
      name: result.user.displayName,
      email: result.user.email,
      role: 'Educator',
      photo: result.user.photoURL,
      uid: result.user.uid
    }

    try {
      // Send data to backend for verification
      const response = await axios.post(
        'https://dark-caldron-448714-u5.uc.r.appspot.com/google/signup',
        userData
      )

      if (response.data && response.data.token) {
        // Store auth token
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user_id', result.user.uid)
        router.push('/dashboard')
        // Stay on the same page and update UI accordingly
        user.value = userData
      }
    } catch (error) {
      if (error.response) {
        // Extract error message from server response
        errorMessage.value = error.response.data.message
      } else {
        errorMessage.value = 'An unexpected error occurred!'
      }
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while signing in.'
  }
}

const signUpWithGoogleAsStudent = async () => {
  try {
    errorMessage.value = ''

    // Sign in with Google
    const result = await signInWithPopup(auth, provider)

    // Extract user details
    const userData = {
      name: result.user.displayName,
      email: result.user.email,
      role: 'Student',
      photo: result.user.photoURL,
      uid: result.user.uid
    }

    try {
      // Send data to backend for verification
      const response = await axios.post(
        'https://dark-caldron-448714-u5.uc.r.appspot.com/google/signup',
        userData
      )

      if (response.data && response.data.token) {
        // Store auth token
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user_id', result.user.uid)
        router.push('/dashboard')
        // Stay on the same page and update UI accordingly
        user.value = userData
      }
    } catch (error) {
      if (error.response) {
        // Extract error message from server response
        errorMessage.value = error.response.data.message
      } else {
        errorMessage.value = 'An unexpected error occurred!'
      }
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while signing in.'
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
