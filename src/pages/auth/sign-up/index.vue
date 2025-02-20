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
        <GoogleLogo class="cursor-pointer" @click="signUpWithGoogle" />
        <FacebookLogo class="cursor-pointer" @click="signUpWithFacebook" />
      </div>

      <div class="flex flex-row items-center justify-center gap-4">
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
        />

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
          size="md"
          :disabled="isLoading || !isValidEmail(email)"
          @click="signup"
        >
          <span v-if="!isLoading">Sign up with email</span>
          <span v-else class="flex items-center">
            <Loader class="h-5 w-5" />
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
import GoogleLogo from '@/assets/media/svgs/signin-google.vue'
import FacebookLogo from '@/assets/media/svgs/signin-facebook.vue'
import { isValidEmail } from '@/utils/isValidEmail'
import Loader from '@/components/loader/Loader.vue'
import { useAuthenticationStore } from '~/store/auth'

const name = ref('')
const role = ref('Student') // Stores selected role
const roles = ['Student', 'Educator'] // Dropdown options
const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)

const store = useAuthenticationStore()

const signup = () => {
  store.signup(email.value, password.value, name.value, role.value)
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
