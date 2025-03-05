
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
          <div class="relative w-full mb-4">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="confirm_password"
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
        <UButton 
            class="w-full bg-[#5D3BEA] items-center justify-center text-white p-3 rounded mb-4" 
            size="md"
            @click="newPassword"
            variant="none">
            <span v-if="!isLoading">Save new password</span>
            <span v-else class="flex items-center">
              <Loader class="h-5 w-5 animate-spin" />
            </span>
        </UButton>
      </form>

      <p class="text-sm text-black">
        Didn't Redirect?
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
import Loader from '@/components/loader/Loader.vue'
import { useAuthenticationStore } from '~/store/auth'

const password = ref('')
const confirm_password = ref('')
const isPasswordVisible = ref(false)

const store = useAuthenticationStore()

const newPassword = () => {
  store.newPassword(password.value, confirm_password.value)
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
