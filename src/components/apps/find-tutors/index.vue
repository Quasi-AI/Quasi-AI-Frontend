<template>
  <div class="flex flex-col gap-4">
    <!-- Create Tutor & Search Bar -->
    <div
      class="mb-6 flex flex-col items-center justify-between gap-4 lg:flex-row"
    >
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search tutors by name or subject"
        class="my-2 w-full rounded-lg border bg-white p-2 lg:w-[350px] dark:border-none dark:bg-[#111C44]"
      />

      <button
        class="mr-4 rounded-lg bg-[#5D3BEA] px-6 py-1 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        @click="openCreateTutorModal"
      >
        Create Tutor
      </button>
    </div>

    <!-- Cards Grid -->
    <div
      class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      <div
        v-for="(tutor, index) in filteredTutors"
        :key="tutor.id"
        class="animate-slide-up cursor-pointer rounded-lg bg-white transition-all duration-300 hover:shadow-xl dark:bg-[#111C44]"
        :style="{ animationDelay: `${index * 0.2}s` }"
        :class="{ 'pointer-events-none opacity-50': tutor.status }"
      >
        <img
          :src="tutor.image || defaultProfileImage"
          alt="Tutor"
          class="h-80 w-full rounded-t-lg object-cover lg:h-40"
          @click="openModal(tutor)"
        />
        <div class="p-2">
          <h2 class="mt-3 text-lg font-semibold">{{ tutor.name }}</h2>
          <p class="text-gray-400">{{ tutor.subject }}</p>
          <p v-if="tutor.status" class="py-2 text-red-400">Inactive</p>
          <div class="mt-6 flex items-center justify-between">
            <p
              @click="openModal(tutor)"
              class="truncate text-sm font-medium text-blue-500 underline transition hover:text-blue-600"
            >
              View biography
            </p>
            <!-- Show Edit and Delete icons only if user_id matches -->
            <div
              v-if="tutor.user_id === localStorageUserId"
              class="flex items-center space-x-2"
            >
              <EditIcon
                @click="openEditTutorModal(tutor)"
                class="h-4 w-4 cursor-pointer"
              />
              <DeleteIcon
                @click="openDeleteTutorModal(tutor)"
                class="h-4 w-4 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-end overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="relative flex h-full max-h-full w-full max-w-lg flex-col overflow-y-auto bg-white p-6 shadow-2xl dark:bg-[#111C44]"
        @click.stop
      >
        <!-- Close Button -->
        <button
          class="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700"
          @click="closeModal"
        >
          &times;
        </button>

        <!-- Profile Image -->
        <div class="mt-10 flex flex-col items-center">
          <img
            :src="selectedTutor.image || defaultProfileImage"
            alt="Tutor"
            class="h-80 rounded-t-lg transition hover:opacity-80"
          />
        </div>

        <!-- Tutor Info -->
        <div class="mt-4">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ selectedTutor.name }}
          </h2>
          <p class="mt-1 text-gray-500">{{ selectedTutor.subject }}</p>
        </div>

        <!-- Biography -->
        <div class="mt-4 border-b py-4 dark:border-[#0C1438]">
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-300">
            Biography
          </h3>
          <p
            class="mt-2 max-h-40 overflow-auto text-sm text-gray-600 dark:text-gray-400"
          >
            {{ selectedTutor.bios }}
          </p>

          <h3 class="mt-5 text-lg font-medium text-gray-800 dark:text-gray-300">
            Price
          </h3>
          <p
            class="mt-2 max-h-40 overflow-auto text-sm text-gray-600 dark:text-gray-400"
          >
            $ {{ selectedTutor.price }}
          </p>
        </div>

        <!-- Chat Messages -->
        <div class="flex flex-grow flex-col space-y-2 overflow-y-auto p-4">
          <div
            v-for="(msg, index) in chatMessages"
            :key="index"
            class="flex w-full"
          >
            <div
              :class="{
                'ml-auto bg-[#5D3BE9] text-white': msg.sender === 'user',
                'mr-auto text-gray-500 dark:bg-[#0C1438]':
                  msg.sender === 'tutor'
              }"
              class="max-w-[80%] rounded-lg px-4 py-2"
            >
              {{ msg.text }}
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div
          class="mb-10 flex items-center rounded-full bg-white p-3 lg:mb-0 dark:bg-[#0C1438]"
        >
          <!-- Message Input -->
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
            class="my-2 flex-grow rounded-full bg-gray-200 p-2 dark:bg-[#0C1438]"
            @keyup.enter="sendMessage"
          />

          <!-- Send Message Button -->
          <button
            class="ml-3 rounded-full p-2 text-blue-600 transition"
            @click="sendMessage"
          >
            <font-awesome-icon :icon="['fas', 'fa-paper-plane']" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for create or edit a tutor -->
    <UModal v-model="createEditTutorModal">
      <UCard class="p-6">
        <h1 class="mb-4 text-xl font-semibold">
          {{ isEditing ? 'Edit Tutor' : 'Add Tutor' }}
        </h1>
        <!-- Profile Picture Upload -->
        <div class="flex flex-col items-center">
          <label for="file-upload" class="relative cursor-pointer text-left">
            <img
              :src="profileImageSrc || defaultProfileImage"
              class="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
              alt="Profile"
            />
            <input
              id="file-upload"
              type="file"
              class="hidden"
              @change="handleFileChange"
            />
            <p class="mt-2 cursor-pointer text-sm text-blue-600">
              Upload picture
            </p>
          </label>
        </div>

        <!-- Form Fields -->
        <div class="mt-6 space-y-4">
          <UInput
            v-model="tutor.name"
            label="Name"
            placeholder="Enter name"
            variant="none"
            class="my-2 w-full rounded-lg border bg-white p-2 dark:border-none dark:bg-[#111C44]"
          />
          <UInput
            v-model="tutor.subject"
            label="Subject"
            placeholder="Enter subject"
            variant="none"
            class="my-2 w-full rounded-lg border bg-white p-2 dark:border-none dark:bg-[#111C44]"
          />
          <UInput
            v-model="tutor.price"
            label="Price"
            placeholder="Enter price"
            type="number"
            variant="none"
            class="my-2 w-full rounded-lg border bg-white p-2 dark:border-none dark:bg-[#111C44]"
          />
          <UTextarea
            v-model="tutor.bios"
            label="Biography"
            placeholder="Enter biography"
            variant="none"
            class="my-2 w-full rounded-lg border bg-white p-2 dark:border-none dark:bg-[#111C44]"
          />
        </div>

        <!-- Modal Actions -->
        <div
          class="mt-6 flex flex-col items-center gap-3 lg:flex-row lg:justify-end"
        >
          <UButton
            color="gray"
            @click="closeCreateEditModal"
            variant="none"
            class="flex w-[150px] items-center justify-center rounded-md border border-[#5D3BEA] bg-white py-2 text-[#5D3BEA] transition hover:scale-105 hover:bg-gray-300 lg:w-[150px]"
            >Close modal</UButton
          >
          <UButton
            @click="saveTutor"
            class="flex w-[150px] items-center justify-center rounded-md bg-[#5D3BEA] py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            variant="none"
            >{{ isEditing ? 'Update Tutor' : 'Add Tutor' }}</UButton
          >
        </div>
      </UCard>
    </UModal>

    <!-- Modal for deleting a tutor -->
    <UModal v-model="deleteTutorModal">
      <UCard class="p-6">
        <h1 class="mb-4 text-xl font-semibold">Delete Tutor</h1>
        <p>
          Are you sure you want to delete
          <span class="font-extrabold">{{ selectedTutor.name }}</span> from
          Quasi AI? <br />
          Students will not be able to find and chat with this tutor anymore
        </p>

        <!-- Modal Actions -->
        <div class="mt-6 flex justify-end space-x-2">
          <UButton
            color="gray"
            @click="closeDeleteTutorModal"
            variant="none"
            class="flex w-[130px] items-center justify-center rounded-md border border-[#5D3BEA] bg-white py-2 text-[#5D3BEA] transition hover:scale-105 hover:bg-gray-300"
            >Close modal</UButton
          >
          <UButton
            @click="deleteTutor"
            class="flex w-[150px] items-center justify-center rounded-md bg-[#5D3BEA] py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            variant="none"
            >Delete tutor</UButton
          >
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import EditIcon from '~/assets/icons/edit-icon.vue'
import DeleteIcon from '~/assets/icons/delete-icon.vue'
import {
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL
} from '~/utils/firebase'

const createEditTutorModal = ref(false)
const deleteTutorModal = ref(false)
const showModal = ref(false)
const selectedTutor = ref({})
const searchQuery = ref('')
const chatMessages = ref([])
const newMessage = ref('')
const isEditing = ref(false)
const tutors = ref([])
const localStorageUserId = ref(localStorage.getItem('user_id'))

const tutor = ref({
  id: null,
  name: '',
  subject: '',
  price: '',
  bios: '',
  image: ''
})

const profileImageSrc = ref('') // For image preview
const fileInput = ref(null) // Reference to file input
const defaultProfileImage =
  'https://cdn-icons-png.flaticon.com/512/929/929422.png'

// Fetch all tutors on component mount
onMounted(async () => {
  await fetchTutors()
})

const fetchTutors = async () => {
  try {
    const response = await axios.get(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/tutor/all'
    )
    tutors.value = response.data
  } catch (error) {
    console.error('Error fetching tutors:', error)
  }
}

const filteredTutors = computed(() => {
  return tutors.value.filter(
    tutor =>
      tutor.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openModal = tutor => {
  if (!tutor.status) {
    selectedTutor.value = tutor
    showModal.value = true
    fetchChatMessages(tutor._id) // Fetch chat messages when modal opens
  }
}

const closeModal = () => {
  showModal.value = false
}

const openCreateTutorModal = () => {
  isEditing.value = false
  tutor.value = {
    id: null,
    name: '',
    subject: '',
    price: '',
    bios: '',
    image: ''
  }
  profileImageSrc.value = ''
  createEditTutorModal.value = true
}

const openEditTutorModal = tutorData => {
  isEditing.value = true
  tutor.value = { ...tutorData }
  profileImageSrc.value = tutorData.image
  createEditTutorModal.value = true
}

const openDeleteTutorModal = tutorData => {
  selectedTutor.value = tutorData
  deleteTutorModal.value = true
}

const handleFileChange = async event => {
  const file = event.target.files[0]
  if (file) {
    // Display preview
    profileImageSrc.value = URL.createObjectURL(file)

    // Upload to Firebase
    try {
      const filePath = `tutors/${Date.now()}_${file.name}`
      const storageReference = storageRef(storage, filePath)

      // Upload file to Firebase
      const snapshot = await uploadBytes(storageReference, file)

      // Get the public URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Save the URL to the tutor object
      tutor.value.image = downloadURL
    } catch (error) {
      console.error('Error uploading to Firebase:', error)
    }
  }
}

const saveTutor = async () => {
  try {
    const user_id = localStorage.getItem('user_id')
    if (!user_id) {
      console.error('User ID not found in localStorage')
      return
    }

    // Prepare the payload
    const payload = {
      name: tutor.value.name,
      subject: tutor.value.subject,
      price: tutor.value.price,
      bios: tutor.value.bios,
      user_id: user_id,
      image: tutor.value.image // Firebase image URL
    }

    if (isEditing.value) {
      await axios.put(
        `https://dark-caldron-448714-u5.uc.r.appspot.com/edit-tutor/${tutor.value._id}`,
        payload
      )
    } else {
      await axios.post(
        'https://dark-caldron-448714-u5.uc.r.appspot.com/add-tutor',
        payload
      )
    }

    await fetchTutors()
    closeCreateEditModal()
  } catch (error) {
    console.error('Error saving tutor:', error)
  }
}

const deleteTutor = async () => {
  try {
    await axios.delete(
      `https://dark-caldron-448714-u5.uc.r.appspot.com/delete-tutor/${selectedTutor.value._id}`
    )
    await fetchTutors()
    closeDeleteTutorModal()
  } catch (error) {
    console.error('Error deleting tutor:', error)
  }
}

const closeCreateEditModal = () => {
  createEditTutorModal.value = false
}

const closeDeleteTutorModal = () => {
  deleteTutorModal.value = false
}

// Fetch chat messages for a specific tutor
const fetchChatMessages = async (tutorId) => {
  try {
    const response = await axios.get(
      `https://dark-caldron-448714-u5.uc.r.appspot.com/tutor-chat?tutor_id=${tutorId}&student_id=${localStorageUserId.value}`
    )
    chatMessages.value = response.data.chatHistory.map(msg => ({
      text: msg.content,
      sender: msg.sender_id === localStorageUserId.value ? 'user' : 'tutor'
    }))
  } catch (error) {
    console.error('Error fetching chat messages:', error)
  }
}

// Send a new message
const sendMessage = async () => {
  if (newMessage.value.trim() === '') return

  try {
    const payload = {
      tutor_id: selectedTutor.value._id,
      student_id: localStorageUserId.value,
      sender_id: localStorageUserId.value,
      receiver_id: selectedTutor.value._id,
      message: newMessage.value
    }

    await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/tutor-chat',
      payload
    )

    // Add the new message to the chat
    chatMessages.value.push({
      text: newMessage.value,
      sender: 'user'
    })

    // Clear the input
    newMessage.value = ''
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px;
}

.opacity-50 {
  opacity: 0.5;
}

.pointer-events-none {
  pointer-events: none;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #5d3be9;
  border-radius: 10px;
}
</style>
