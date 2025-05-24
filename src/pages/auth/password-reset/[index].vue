<template>
  <div class="flex h-screen">
    <div
      class="flex h-full w-full flex-col items-center justify-center bg-white px-10 dark:bg-[#111C44] md:w-1/2"
    >
      <NuxtLink to="/" class="mb-4 flex items-center justify-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/.github/refs/heads/main/quasiailogo.png"
          alt="QUASI AI Logo"
          class="w-8 cursor-pointer"
        />
        <h1 class="text-2xl font-bold dark:text-white">QUASI AI</h1>
      </NuxtLink>
      <p class="mb-6 text-center text-gray-500 dark:text-gray-300">
        We will send you reset instruction in your email
      </p>

      <form class="w-full max-w-sm">
        <div class="relative mb-4 w-full">
          <input
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            v-model="confirm_password"
            id="confirm_password"
            class="peer w-full rounded border border-gray-300 bg-white p-3 placeholder-transparent focus:border-purple-500 focus:ring-0 dark:border-gray-700 dark:bg-[#1E2A5A] dark:text-white"
            placeholder="Confirm Password"
          />
          <label
            for="confirm_password"
            class="absolute left-3 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-purple-600 dark:bg-[#1E2A5A] dark:text-gray-300 dark:peer-focus:text-purple-400"
          >
            Confirm Password
          </label>
          <span
            class="absolute inset-y-0 right-3 flex cursor-pointer items-center"
            @click="togglePasswordVisibility"
          >
            <UIcon
              :name="
                isPasswordVisible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'
              "
              class="text-gray-500 dark:text-gray-300"
            ></UIcon>
          </span>
        </div>

        <div class="relative mb-4 w-full">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            id="password"
            class="peer w-full rounded border border-gray-300 bg-white p-3 placeholder-transparent focus:border-purple-500 focus:ring-0 dark:border-gray-700 dark:bg-[#1E2A5A] dark:text-white"
            placeholder="Password"
          />
          <label
            for="password"
            class="absolute left-3 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-purple-600 dark:bg-[#1E2A5A] dark:text-gray-300 dark:peer-focus:text-purple-400"
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
              class="text-gray-500 dark:text-gray-300"
            ></UIcon>
          </span>
        </div>

        <UButton
          class="mb-4 w-full items-center justify-center rounded bg-[#5D3BEA] p-3 text-white"
          size="md"
          @click="newPassword"
          variant="none"
        >
          <span v-if="!isLoading">Save new password</span>
          <span v-else class="flex items-center">
            <CommonLoader class="h-5 w-5 animate-spin" />
          </span>
        </UButton>
      </form>

      <p class="text-sm text-black dark:text-white">
        Didn't Redirect?
        <NuxtLink to="/auth/login" class="text-[#5D3BEA]">Login</NuxtLink>
      </p>
    </div>

    <div
      class="hidden w-1/2 overflow-hidden bg-gray-100 dark:bg-[#0C1438] md:block"
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/park4me-b2127.appspot.com/o/freepik__the-style-is-candid-image-photography-with-natural__28525.png?alt=media&token=8a662acd-7725-41cb-9601-785985db76b9"
        alt="cover"
        class="h-full w-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
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
