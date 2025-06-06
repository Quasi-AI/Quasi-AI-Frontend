<template>
  <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44]">
    <div class="mb-4 flex items-center justify-between">
      <h4 class="font-medium text-gray-900 dark:text-white">Password</h4>
      <button
        v-if="!isEditing"
        @click="startEditing"
        class="flex items-center text-sm text-[#5D3BEA] hover:text-[#4A2DCA]"
      >
        <Icon name="heroicons:pencil" class="mr-1 h-4 w-4" />
        Change
      </button>
    </div>

    <div v-if="!isEditing" class="space-y-2">
      <p class="text-lg font-medium text-gray-900 dark:text-white">
        ••••••••••••
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Last updated {{ lastPasswordUpdate || 'Unknown' }}
      </p>
    </div>

    <form v-else @submit.prevent="changePassword" class="space-y-4">
      <div>
        <label
          class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Current Password
        </label>
        <UInput
          v-model="currentPassword"
          type="password"
          placeholder="Enter current password"
          :loading="saving"
          class="w-full"
          size="lg"
        />
      </div>

      <div>
        <label
          class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          New Password
        </label>
        <UInput
          v-model="newPassword"
          type="password"
          placeholder="Enter new password"
          :loading="saving"
          class="w-full"
          size="lg"
        />

        <!-- Password Strength Indicator -->
        <div v-if="newPassword" class="mt-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400"
              >Password strength:</span
            >
            <span :class="passwordStrengthColor">{{
              passwordStrengthText
            }}</span>
          </div>
          <div
            class="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"
          >
            <div
              class="h-2 rounded-full transition-all duration-300"
              :class="passwordStrengthColor.replace('text-', 'bg-')"
              :style="{ width: passwordStrengthWidth + '%' }"
            ></div>
          </div>
        </div>

        <!-- Password Requirements -->
        <div v-if="newPassword" class="mt-2 space-y-1 text-sm">
          <div class="flex items-center gap-2">
            <Icon
              :name="
                passwordRequirements.length
                  ? 'heroicons:check-circle'
                  : 'heroicons:x-circle'
              "
              :class="
                passwordRequirements.length ? 'text-green-500' : 'text-red-500'
              "
              class="h-4 w-4"
            />
            <span
              :class="
                passwordRequirements.length
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              At least 8 characters
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Icon
              :name="
                passwordRequirements.uppercase
                  ? 'heroicons:check-circle'
                  : 'heroicons:x-circle'
              "
              :class="
                passwordRequirements.uppercase
                  ? 'text-green-500'
                  : 'text-red-500'
              "
              class="h-4 w-4"
            />
            <span
              :class="
                passwordRequirements.uppercase
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              One uppercase letter
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Icon
              :name="
                passwordRequirements.number
                  ? 'heroicons:check-circle'
                  : 'heroicons:x-circle'
              "
              :class="
                passwordRequirements.number ? 'text-green-500' : 'text-red-500'
              "
              class="h-4 w-4"
            />
            <span
              :class="
                passwordRequirements.number
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              One number
            </span>
          </div>
        </div>
      </div>

      <div>
        <label
          class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirm New Password
        </label>
        <UInput
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          :loading="saving"
          class="w-full"
          size="lg"
        />
      </div>

      <div class="flex gap-3">
        <UButton
          type="submit"
          :loading="saving"
          :disabled="!isPasswordValid"
          class="bg-[#5D3BEA] hover:bg-[#4A2DCA]"
        >
          Change Password
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
// Reactive data
const isEditing = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const message = ref(null)
const lastPasswordUpdate = ref('2 months ago')

// Computed properties
const passwordRequirements = computed(() => ({
  length: newPassword.value.length >= 8,
  uppercase: /[A-Z]/.test(newPassword.value),
  number: /\d/.test(newPassword.value)
}))

const passwordStrength = computed(() => {
  const requirements = passwordRequirements.value
  const score = Object.values(requirements).filter(Boolean).length

  if (score === 0) return 0
  if (score === 1) return 1
  if (score === 2) return 2
  return 3
})

const passwordStrengthText = computed(() => {
  const texts = ['Weak', 'Fair', 'Good', 'Strong']
  return texts[passwordStrength.value] || 'Weak'
})

const passwordStrengthColor = computed(() => {
  const colors = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-green-500'
  ]
  return colors[passwordStrength.value] || 'text-red-500'
})

const passwordStrengthWidth = computed(() => {
  return (passwordStrength.value + 1) * 25
})

const isPasswordValid = computed(() => {
  return (
    Object.values(passwordRequirements.value).every(Boolean) &&
    newPassword.value === confirmPassword.value &&
    currentPassword.value.length > 0
  )
})

// Methods
const startEditing = () => {
  isEditing.value = true
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  message.value = null
}

const cancelEditing = () => {
  isEditing.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  message.value = null
}

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    message.value = {
      type: 'error',
      text: 'New passwords do not match'
    }
    return
  }

  if (!Object.values(passwordRequirements.value).every(Boolean)) {
    message.value = {
      type: 'error',
      text: 'Password does not meet requirements'
    }
    return
  }

  saving.value = true
  try {
    // Implement password change logic here
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call

    isEditing.value = false
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    lastPasswordUpdate.value = 'Just now'

    message.value = {
      type: 'success',
      text: 'Password changed successfully!'
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = null
    }, 3000)
  } catch (error) {
    message.value = {
      type: 'error',
      text: 'Failed to change password. Please check your current password and try again.'
    }
  } finally {
    saving.value = false
  }
}
</script>
