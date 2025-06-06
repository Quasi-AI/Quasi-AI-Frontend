<template>
  <div class="p-6">
    <div>
      <!-- Header Section -->
      <div class="mb-8 text-center">
        <h1
          class="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl"
        >
          Profile Settings
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Manage your account settings and preferences
        </p>
      </div>

      <!-- Profile Overview Card -->
      <div
        class="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-[#111C44] lg:p-8"
      >
        <div class="flex flex-col items-center gap-6 lg:flex-row">
          <!-- Profile Image -->
          <div class="relative">
            <CommonProfileImage
              :img-src="userInfo?.profileImage"
              :name="userInfo?.name"
              :scale="true"
              baseClass="w-24 h-24 lg:w-32 lg:h-32"
            />
            <button
              class="absolute -bottom-2 -right-2 h-6 w-6 rounded-full p-2"
              @click="openImageUpload"
            >
              <Icon name="heroicons:camera" class="h-4 w-4" />
            </button>
          </div>

          <!-- User Info -->
          <div class="flex-1 text-center lg:text-left">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ userInfo?.name || 'User Name' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ userInfo?.email || 'user@example.com' }}
            </p>
            <div
              class="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start"
            >
              <span
                class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                <Icon name="heroicons:check-circle" class="mr-1 h-4 w-4" />
                Active Account
              </span>
              <span
                class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                <Icon name="heroicons:user" class="mr-1 h-4 w-4" />
                Free Plan
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <NuxtLink
              to="/apps/other/plan"
              class="inline-flex items-center rounded-lg bg-gradient-to-r from-[#5D3BEA] to-[#4A2DCA] px-4 py-2 text-sm font-medium text-white transition hover:scale-105"
            >
              <Icon name="heroicons:star" class="mr-2 h-4 w-4" />
              Upgrade Plan
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Settings Grid -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Personal Information -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h3>

          <UserName />
          <UserEmail />
        </div>

        <!-- Security Settings -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Security & Privacy
          </h3>

          <UserPassword />

          <!-- Additional Security Options -->
          <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44]">
            <h4 class="mb-4 font-medium text-gray-900 dark:text-white">
              Security Options
            </h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <UToggle disabled />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Receive updates about your account activity
                  </p>
                </div>
                <UToggle v-model="emailNotifications" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Actions -->
      <div class="mt-8 rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44]">
        <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Account Actions
        </h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            class="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-[#0C1438] dark:text-gray-300 dark:hover:bg-gray-800"
            @click="exportData"
          >
            <Icon name="heroicons:arrow-down-tray" class="mr-2 h-4 w-4" />
            Export Data
          </button>

          <button
            class="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-[#0C1438] dark:text-gray-300 dark:hover:bg-gray-800"
            @click="clearCache"
          >
            <Icon name="heroicons:arrow-path" class="mr-2 h-4 w-4" />
            Clear Cache
          </button>

          <button
            class="flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-600 dark:bg-[#0C1438] dark:text-red-400 dark:hover:bg-red-900"
            @click="deleteAccount"
          >
            <Icon name="heroicons:trash" class="mr-2 h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Image Upload Modal -->
    <UModal v-model="showImageUpload">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Update Profile Picture</h3>
        </template>

        <div class="space-y-4">
          <div class="flex justify-center">
            <div class="relative">
              <img
                :src="
                  previewImage ||
                  userInfo?.profileImage ||
                  'https://cdn-icons-png.flaticon.com/512/929/929422.png'
                "
                alt="Profile preview"
                class="h-32 w-32 rounded-full object-cover"
              />
            </div>
          </div>

          <div class="flex items-center justify-center">
            <label
              class="cursor-pointer rounded-lg bg-[#5D3BEA] px-4 py-2 text-white transition hover:bg-[#4A2DCA]"
            >
              Choose Image
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageSelect"
              />
            </label>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" @click="showImageUpload = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="uploadingImage"
              @click="uploadImage"
            >
              Save Changes
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/useUser'

const { userInfo } = useUser()

// Reactive data
const emailNotifications = ref(true)
const showImageUpload = ref(false)
const previewImage = ref('')
const selectedFile = ref(null)
const uploadingImage = ref(false)

// Methods
const openImageUpload = () => {
  showImageUpload.value = true
}

const handleImageSelect = event => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = e => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const uploadImage = async () => {
  if (!selectedFile.value) return

  uploadingImage.value = true
  try {
    // Implement image upload logic here
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate upload
    showImageUpload.value = false
    previewImage.value = ''
    selectedFile.value = null

    // Show success notification
    const toast = useToast()
    toast.add({
      title: 'Profile picture updated successfully!',
      color: 'green'
    })
  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    uploadingImage.value = false
  }
}

const exportData = () => {
  const toast = useToast()
  toast.add({
    title: 'Data export started',
    description: 'You will receive an email with your data shortly.'
  })
}

const clearCache = () => {
  const toast = useToast()
  toast.add({
    title: 'Cache cleared successfully',
    color: 'green'
  })
}

const deleteAccount = () => {
  const toast = useToast()
  toast.add({
    title: 'Account deletion is not available yet',
    description: 'Please contact support for account deletion.',
    color: 'red'
  })
}
</script>
