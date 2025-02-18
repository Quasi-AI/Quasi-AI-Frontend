<template>
  <NuxtLayout name="auth-wrapper">
    <div
      class="w-full max-w-[569px] rounded-2xl bg-white py-6 text-center text-2xl lg:shadow-md"
    >
      <NuxtLink to="/" class="flex items-center justify-center gap-2">
        <img
          src="https://raw.githubusercontent.com/Quasi-AI/Quasi-AI-Frontend/refs/heads/develop/src/assets/quasiailogo.png"
          alt="logo"
          class="w-10 cursor-pointer"
        />
        <h1 class="text-2xl font-bold">QUASI AI</h1>
      </NuxtLink>

      <!-- Success & Error Messages -->
      <div class="mx-8">
        <SuccessAlert v-if="successMessage" :message="successMessage" />
        <ErrorAlert v-if="errorMessage" :message="errorMessage" />
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

        <UButton
          variant=""
          class="flex w-full items-center justify-center rounded-md bg-[#5D3BEA] text-white"
          label="Sign in"
          size="md"
          :disabled="!isValidEmail(email) || isLoading"
          @click="reset"
        >
          <span v-if="!isLoading">Recover Account</span>
          <span v-else class="flex items-center">
            <Loader class="w-5 h-5" />
          </span>
        </UButton>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import Loader from "@/components/loader/Loader.vue"
import SuccessAlert from "@/components/success/SuccessAlert.vue"
import ErrorAlert from "@/components/error/ErrorAlert.vue"
import axios from 'axios'
import { isValidEmail } from '@/utils/isValidEmail'

const email = ref("")
const isLoading = ref(false)
const successMessage = ref("")
const errorMessage = ref("")

const reset = async () => {
  if (!isValidEmail(email.value)) {
    console.error("Invalid email format.")
    return
  }
  isLoading.value = true
  successMessage.value = ""
  errorMessage.value = ""

  try {
    const response = await axios.post('https://dark-caldron-448714-u5.uc.r.appspot.com/user/request', {
      email: email.value
    })
    
    if (response.status === 200) {
      successMessage.value = "Email sent successful!, Kindly check your mail"
      // router.push('/auth/index.vue')
    } else {
      errorMessage.value = response.data.message || "⚠️ Something went wrong!"
    }
  } catch (error) {
    console.error('An error occurred during reset:', error)
  }finally {
    isLoading.value = false
  }
}

</script>

