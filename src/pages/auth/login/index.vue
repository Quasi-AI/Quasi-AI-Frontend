<template>
  <NuxtLayout name="auth-wrapper">
    <div
      class="w-full max-w-[569px] rounded-2xl bg-white py-6 text-center text-2xl lg:shadow-md"
    >
      <NuxtLink to="/" class="flex items-center justify-center gap-2 mb-4">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="logo"
          class="w-10 cursor-pointer"
        />
        <h1 class="text-2xl font-bold">QUASI AI</h1>
      </NuxtLink>

      <div class="mx-4 flex flex-col items-center justify-center space-y-2">
        <v-alert v-if="errorMessage" type="error" class="w-full">{{ errorMessage }}</v-alert>
        <UButton
          class="flex w-full items-center justify-center gap-2 rounded-md bg-[#1A73E8] text-white hover:bg-[#1558C4] transition-colors duration-200"
          size="md"
          @click="signInWithGoogle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" class="h-5 w-5 fill-white">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
          </svg>
          <span>Sign in with Google As Student or Educator</span>
        </UButton>
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

        <div class="flex flex-row items-center justify-center gap-4">
          <OrSeperator class="w-3/4 sm:w-2/3" />
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
import OrSeperator from '@/assets/media/svgs/or-seperator.vue'
import { auth, provider, signInWithPopup } from "@/firebase";
import axios from "axios";

const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const isLoading = ref(false)
const store = useAuthenticationStore()
const router = useRouter()
const errorMessage = ref("");

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


const signInWithGoogle = async () => {
    let result = await signInWithPopup(auth, provider);
    const userData = {
      name: result.user.displayName,
      email: result.user.email,
      uid: result.user.uid,
      photo: result.user.photoURL
    };
    try{
      let response = await axios.post("https://dark-caldron-448714-u5.uc.r.appspot.com/google/signin", userData);
    
    if (response.data && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem('user_id', result.user.uid)
      router.push("/dashboard");
    } 

    }catch (error) {
      if (error.response) {
        // Extract error message from server response
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = 'An unexpected error occurred!';
      }
    }
};

</script>

