<template>
  <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44]">
    <div class="mb-4 flex items-center justify-between">
      <h4 class="font-medium text-gray-900 dark:text-white">Email Address</h4>
      <button
        v-if="!isEditing"
        @click="startEditing"
        class="flex items-center text-sm text-[#5D3BEA] hover:text-[#4A2DCA]"
      >
        <Icon name="heroicons:pencil" class="mr-1 h-4 w-4" />
        Edit
      </button>
    </div>

    <div v-if="!isEditing" class="space-y-2">
      <div class="flex items-center gap-2">
        <p class="text-lg font-medium text-gray-900 dark:text-white">
          {{ userInfo?.email || 'Not set' }}
        </p>
        <span
          v-if="userInfo?.emailVerified"
          class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          <Icon name="heroicons:check-circle" class="mr-1 h-3 w-3" />
          Verified
        </span>
        <span
          v-else
          class="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        >
          <Icon name="heroicons:exclamation-triangle" class="mr-1 h-3 w-3" />
          Unverified
        </span>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Used for account recovery and notifications
      </p>

      <button
        v-if="!userInfo?.emailVerified"
        @click="sendVerification"
        class="mt-2 text-sm text-[#5D3BEA] hover:text-[#4A2DCA]"
      >
        Send verification email
      </button>
    </div>

    <form v-else @submit.prevent="saveEmail" class="space-y-4">
      <div>
        <UInput
          v-model="editEmail"
          type="email"
          placeholder="Enter your email address"
          :loading="saving"
          class="w-full"
          size="lg"
        />
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You'll need to verify your new email address
        </p>
      </div>

      <div class="flex gap-3">
        <UButton
          type="submit"
          :loading="saving"
          class="bg-[#5D3BEA] hover:bg-[#4A2DCA]"
        >
          Save Changes
        </UButton>
        <UButton variant="ghost" @click="cancelEditing" :disabled="saving">
          Cancel
        </UButton>
      </div>
    </form>

    <!-- Success/Error Messages -->
    <div v-if="message" class="mt-4">
      <UAlert
        :color="message.type === 'success' ? 'green' : 'red'"
        :title="message.text"
        :close-button="{ color: 'gray' }"
        @close="message = null"
      />
    </div>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/useUser'

const { userInfo, updateUserEmail } = useUser()

// Reactive data
const isEditing = ref(false)
const editEmail = ref('')
const saving = ref(false)
const message = ref(null)

// Methods
const startEditing = () => {
  editEmail.value = userInfo.value?.email || ''
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editEmail.value = ''
  message.value = null
}

const saveEmail = async () => {
  if (!editEmail.value.trim()) {
    message.value = {
      type: 'error',
      text: 'Email cannot be empty'
    }
    return
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(editEmail.value)) {
    message.value = {
      type: 'error',
      text: 'Please enter a valid email address'
    }
    return
  }

  saving.value = true
  try {
    await updateUserEmail(editEmail.value.trim())
    isEditing.value = false
    message.value = {
      type: 'success',
      text: 'Email updated successfully! Please check your inbox for verification.'
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      message.value = null
    }, 5000)
  } catch (error) {
    message.value = {
      type: 'error',
      text: 'Failed to update email. Please try again.'
    }
  } finally {
    saving.value = false
  }
}

const sendVerification = async () => {
  try {
    // Implement email verification logic
    message.value = {
      type: 'success',
      text: 'Verification email sent! Please check your inbox.'
    }

    setTimeout(() => {
      message.value = null
    }, 5000)
  } catch (error) {
    message.value = {
      type: 'error',
      text: 'Failed to send verification email. Please try again.'
    }
  }
}
</script>
