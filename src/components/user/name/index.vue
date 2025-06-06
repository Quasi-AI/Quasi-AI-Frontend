<template>
  <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44]">
    <div class="mb-4 flex items-center justify-between">
      <h4 class="font-medium text-gray-900 dark:text-white">Display Name</h4>
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
      <p class="text-lg font-medium text-gray-900 dark:text-white">
        {{ userInfo?.name || 'Not set' }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        This is how your name appears to other users
      </p>
    </div>

    <form v-else @submit.prevent="saveName" class="space-y-4">
      <div>
        <UInput
          v-model="editName"
          placeholder="Enter your display name"
          :loading="saving"
          class="w-full"
          size="lg"
        />
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Use your real name for better recognition
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

const { userInfo, updateUserName } = useUser()

// Reactive data
const isEditing = ref(false)
const editName = ref('')
const saving = ref(false)
const message = ref(null)

// Methods
const startEditing = () => {
  editName.value = userInfo.value?.name || ''
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editName.value = ''
  message.value = null
}

const saveName = async () => {
  if (!editName.value.trim()) {
    message.value = {
      type: 'error',
      text: 'Name cannot be empty'
    }
    return
  }

  saving.value = true
  try {
    await updateUserName(editName.value.trim())
    isEditing.value = false
    message.value = {
      type: 'success',
      text: 'Name updated successfully!'
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = null
    }, 3000)
  } catch (error) {
    message.value = {
      type: 'error',
      text: 'Failed to update name. Please try again.'
    }
  } finally {
    saving.value = false
  }
}
</script>
