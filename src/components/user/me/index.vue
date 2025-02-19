<template>
  <div class="my-6 flex flex-col items-center justify-center">
    <LayoutProfileImage
      :img-src="profileImageSrc"
      :name="userInfo?.name"
      :scale="true"
      baseClass="w-[15rem] h-[15rem] 2xl:w-[20rem] 2xl:h-[20rem] 3xl:w-[25rem] 3xl:h-[25rem]"
    />
    <UBadge
      label="Change photo"
      color="gray"
      class="mt-4 cursor-pointer"
      @click="triggerFileInput"
    />
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/useUser'
import { useAuthenticationStore } from '@/store/auth'

const { userInfo } = useUser()
const authStore = useAuthenticationStore()

const preview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    preview.value = URL.createObjectURL(file)
    await updateProfileImage(file)
  }
}

const updateProfileImage = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('profile_image', file)
    await authStore.updateProfileImage(formData)
  } catch (error) {
    console.error('Error updating profile image:', error)
  }
}

const profileImageSrc = computed(() => {
  return (
    preview.value ||
    (userInfo.value?.profile_image
      ? `https://raw.githubusercontent.com/danieladeabah/da-dailytasks/refs/heads/main/public/profiles/${userInfo.value.profile_image}`
      : '')
  )
})
</script>
