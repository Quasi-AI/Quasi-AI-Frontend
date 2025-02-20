<template>
  <div class="relative my-6">
    <p>
      You are logged in as <strong>{{ userInfo?.name }}</strong
      >, if you wish to update your name please enter it below.
    </p>
  </div>

  <div class="flex flex-col space-y-4">
    <UInput
      variant="none"
      class="my-2 rounded-full bg-gray-200 p-2 dark:bg-[#0C1438]"
      placeholder="Name"
      v-model="name"
      maxLength="250"
      @keyup.enter="updateName"
    />
  </div>
  <p class="text-xs italic text-gray-400">[Press Enter to update]</p>

  <div class="my-5 flex items-center justify-between">
    <NuxtLink to="/dashboard" class="text-[#5D3BEA]">Back</NuxtLink>
    <div class="flex justify-end">
      <UDropdown
        mode="click"
        :popper="{ placement: 'right-start' }"
        :items="deleteLists"
      >
        <UBadge
          label="Delete Account!"
          color="red"
          class="mt-4 cursor-pointer"
        />
      </UDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/useUser'
import { useAuthenticationStore } from '@/store/auth'

const { userInfo } = useUser()
const authStore = useAuthenticationStore()

const name = ref('')

const updateName = async () => {
  if (name.value !== userInfo.value?.name) {
    try {
      await authStore.updateName(name.value)
    } catch (error) {
      console.error('Error updating first name:', error)
    }
  }
}

const deleteAccount = async () => {
  try {
    await authStore.deleteUser()
    authStore.logout()
  } catch (error) {
    console.error('Error deleting account:', error)
  }
}

watch(
  userInfo,
  newUserInfo => {
    if (newUserInfo) {
      name.value = newUserInfo.name
    }
  },
  { immediate: true }
)

const deleteLists = [
  [{ label: 'Cancel' }, { label: 'Yes, Irreversible!', click: deleteAccount }]
]
</script>
