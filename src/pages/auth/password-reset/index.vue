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
        <div class="relative">
          <UInput
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Password"
            v-model="confirm_password"
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

        <div class="relative">
          <UInput
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Confirm Password"
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
          label="Sign in"
          size="md"
          @click="changePassword"
        >
          <span v-if="!isLoading">Change password</span>
          <span v-else class="flex items-center">
            <Loader class="h-5 w-5" />
          </span>
        </UButton>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import Loader from '@/components/loader/Loader.vue'
import SuccessAlert from '@/components/success/SuccessAlert.vue'
import ErrorAlert from '@/components/error/ErrorAlert.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const confirm_password = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const router = useRouter()

const changePassword = async () => {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/user/reset',
      {
        confirm: confirm_password.value,
        password: password.value
      }
    )

    if (response.status === 200) {
      successMessage.value = 'Password Changed successful!'
      router.push('/auth/changePassword')
    } else {
      errorMessage.value = response.data.message || '⚠️ Something went wrong!'
    }
  } catch (error) {
    console.error('An error occurred during changePassword:', error)
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
