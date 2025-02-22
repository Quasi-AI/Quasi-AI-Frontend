<template>
  <NuxtLayout name="auth-wrapper">
    <div
      class="w-full max-w-[569px] rounded-md bg-white py-6 text-center text-2xl lg:shadow-md"
    >
      <NuxtLink to="/" class="mb-4 flex items-center justify-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="logo"
          class="w-10 cursor-pointer"
        />
        <h1 class="text-2xl font-bold">QUASI AI</h1>
      </NuxtLink>

      <div class="mx-12 flex flex-col items-center justify-center space-y-2">
        <p
          v-if="errorMessage"
          class="w-full rounded-md border-l-4 border-red-500 bg-red-100 px-4 py-3 text-sm text-red-700"
        >
          {{ errorMessage }}
        </p>
        <div>
          <p class="text-sm">Sign Up With Google</p>
          <div class="mt-5 flex flex-row items-center justify-center gap-4">
            <UButton
              class="flex w-fit items-center justify-center gap-2 rounded-full border px-16 transition-colors duration-200"
              size="md"
              @click="signUpWithGoogleAsStudent"
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
              <span>As Student</span>
            </UButton>

            <UButton
              class="flex w-fit items-center justify-center gap-2 rounded-full border px-16 transition-colors duration-200"
              size="md"
              @click="signUpWithGoogleAsEducator"
              variant="none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                class="h-5 w-5 fill-red-600"
              >
                <path
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                />
              </svg>
              <span>As Educator</span>
            </UButton>
          </div>
        </div>
      </div>

      <div class="mt-5 flex flex-row items-center justify-center gap-4">
        <OrSeperator class="w-3/4 sm:w-2/3" />
      </div>

      <div class="mx-8 flex flex-col gap-4 py-6 sm:mx-12">
        <UInput
          v-model="name"
          type="text"
          placeholder="Enter name"
          maxLength="250"
          size="xl"
          variant="none"
          class="w-full rounded-2xl bg-[#F1F3FE]"
          @input="validateName"
        />
        <p v-if="nameError" class="text-sm text-red-500">{{ nameError }}</p>

        <UInput
          v-model="email"
          type="email"
          placeholder="Enter email"
          maxLength="250"
          size="xl"
          variant="none"
          class="w-full rounded-2xl bg-[#F1F3FE]"
        />

        <USelect
          variant="none"
          v-model="role"
          :options="roles"
          placeholder="Select Role"
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
            @input="validatePassword"
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
        <p v-if="passwordError" class="text-sm text-red-500">
          {{ passwordError }}
        </p>

        <UButton
          variant=""
          class="flex w-full items-center justify-center rounded-md bg-[#5D3BEA] text-white"
          size="md"
          :disabled="isLoading || !isValidForm"
          @click="signup"
        >
          <span v-if="!isLoading">Sign up with email</span>
          <span v-else class="flex items-center">
            <Loader class="h-5 w-5 animate-spin" />
          </span>
        </UButton>
      </div>

      <p class="text-sm text-black">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-[#5D3BEA]">Sign in</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import OrSeperator from '@/assets/media/svgs/or-seperator.vue'
import { isValidEmail } from '@/utils/isValidEmail'
import Loader from '@/components/loader/Loader.vue'
import { useAuthenticationStore } from '~/store/auth'
import axios from 'axios'
import { auth, provider, signInWithPopup } from '@/firebase'

const router = useRouter() // Get router instance
const name = ref('')
const nameError = ref('')
const role = ref('Student')
const roles = ['Student', 'Educator']
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
