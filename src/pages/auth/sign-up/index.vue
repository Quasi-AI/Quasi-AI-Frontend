<template>
  <NuxtLayout name="auth-wrapper">
    <div class="w-full max-w-[569px] rounded-2xl bg-white py-6 text-center text-2xl lg:shadow-md">
      <NuxtLink to="/" class="flex items-center justify-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/Quasi-AI-Frontend/refs/heads/develop/src/assets/quasiailogo.png"
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

      <!-- Success & Error Messages -->
      <div class="mx-8">
        <SuccessAlert v-if="successMessage" :message="successMessage" />
        <ErrorAlert v-if="errorMessage" :message="errorMessage" />
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
          <span class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3" @click="togglePasswordVisibility">
            <UIcon :name="isPasswordVisible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"></UIcon>
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
            <Loader class="w-5 h-5" />
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
import { ref } from "vue"
import OrSeperator from "@/assets/media/svgs/or-seperator.vue"
import GoogleLogo from "@/assets/media/svgs/signin-google.vue"
import FacebookLogo from "@/assets/media/svgs/signin-facebook.vue"
import { isValidEmail } from "@/utils/isValidEmail"
import Loader from "@/components/loader/Loader.vue"
import SuccessAlert from "@/components/success/SuccessAlert.vue"
import ErrorAlert from "@/components/error/ErrorAlert.vue"
import axios from 'axios'

const email = ref("")
const password = ref("")
const name = ref("")
const role = ref("Student") // Stores selected role
const roles = ["Student", "Educator"] // Dropdown options
const isPasswordVisible = ref(false)
const isLoading = ref(false)
const successMessage = ref("")
const errorMessage = ref("")

const signup = async () => {
  if (!isValidEmail(email.value)) return

  isLoading.value = true
  successMessage.value = ""
  errorMessage.value = ""

  try {
    const response = await axios.post("https://quasi-ai-backend.onrender.com/user/create", {
      name: name.value,
      email: email.value,
      role: role.value,
      password: password.value,
    })

    if (response.status === 200) {
      successMessage.value = "Sign-up successful! Welcome to Quasi AI!"
      router.push('/dashboard/index.vue')
    } else {
      errorMessage.value = response.data.message || "⚠️ Something went wrong!"
    }
  } catch (error) {
    console.error("Error during axios request:", error)
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>