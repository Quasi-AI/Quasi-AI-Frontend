<template>
  <div class="relative my-6">
    <p>If you wish to update your email address, please enter it below.</p>
  </div>

  <div class="flex flex-col">
    <UInput
      variant="none"
      class="my-2 rounded-full bg-gray-200 p-2 dark:bg-[#0C1438]"
      placeholder="Email address"
      v-model="email"
      maxLength="250"
      @keyup.enter="updateEmail"
    />
    <p class="text-xs italic text-gray-400">[Press Enter to update]</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthenticationStore } from '@/store/auth'
import { useUser } from '@/composables/useUser'

const authStore = useAuthenticationStore()
const { userInfo } = useUser()

const email = ref('')

watch(
  userInfo,
  newUserInfo => {
    if (newUserInfo) {
      email.value = newUserInfo.email
    }
  },
  { immediate: true }
)

const updateEmail = async () => {
  if (email.value !== userInfo.value?.email) {
    await authStore.updateEmail(email.value)
  }
}
</script>
