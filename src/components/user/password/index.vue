<template>
  <div class="relative my-6">
    <p>
      You are logged in as <strong>{{ userInfo?.name }}</strong
      >, if you wish to update your password well send you an email.
    </p>
  </div>

  <div class="flex flex-col">
    <p v-if="errorMessage" class="mb-2 text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <div class="relative">
      <UInput
        :type="isPasswordVisible ? 'text' : 'password'"
        variant="none"
        class="my-2 rounded-full bg-gray-200 p-2 dark:bg-[#0C1438]"
        placeholder="new password"
        v-model="email"
        maxLength="250"
        @keydown.enter="forgotPassword"
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
    <p class="text-xs italic text-gray-400">[Press Enter to proceed]</p>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/useUser'
import { useAuthenticationStore } from '@/store/auth'
import { isValidEmail } from '@/utils/isValidEmail'

const { userInfo } = useUser()
const authStore = useAuthenticationStore()
const isPasswordVisible = ref(false)
const email = ref('')
const errorMessage = ref<string | null>(null)

watch(email, newEmail => {
  email.value = newEmail
})

const forgotPassword = () => {
  if (!email.value) {
    errorMessage.value = 'Please enter your email address'
  } else if (!isValidEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address'
  } else {
    authStore.forgotPassword(email.value)
    return
  }

  setTimeout(() => {
    errorMessage.value = null
  }, 3000)
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
