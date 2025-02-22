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
import { ref, computed } from 'vue'
import { useUser } from '@/composables/useUser'
import { useAuthenticationStore } from '@/store/auth'
import { storage, storageRef, uploadBytes, getDownloadURL } from "@/firebase";

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
    await uploadImageToFirebase(file)
  }
}

// 🔹 Upload Image to Firebase Storage
const uploadImageToFirebase = async (file: File) => {
  try {
    const filePath = `Quasi AI/profile/${Date.now()}_${file.name}`
    const storageReference = storageRef(storage, filePath)

    // Upload file to Firebase
    const snapshot = await uploadBytes(storageReference, file)
    
    // Get the public URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    // 🔹 Send Image URL to Backend for Profile Update
    await authStore.updateProfileImage(downloadURL)
  } catch (error) {
    console.error('Error uploading to Firebase:', error)
  }
}


const profileImageSrc = computed(() => {
  return preview.value || userInfo.value?.profileImage || ''
})
</script>
