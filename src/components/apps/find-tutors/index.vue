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
        @click="createEditTutorModal = true"
      >
        Create Tutor
      </button>
    </div>

    <!-- Cards Grid -->
    <div
      class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      <div
        v-for="tutor in filteredTutors"
        :key="tutor.id"
        class="animate-slide-up cursor-pointer rounded-lg bg-white transition-all duration-300 hover:shadow-xl dark:bg-[#111C44]"
        :style="{ animationDelay: `${index * 0.2}s` }"
      >
        <img
          :src="tutor.image"
          alt="Tutor"
          class="h-80 w-full rounded-t-lg object-cover lg:h-40"
          @click="openModal(tutor)"
        />
        <div class="p-2">
          <h2 class="mt-3 text-lg font-semibold">{{ tutor.name }}</h2>
          <p class="text-gray-500">{{ tutor.subject }}</p>

          <div class="mt-6 flex items-center justify-between">
            <p
              @click="openModal(tutor)"
              class="truncate text-sm font-medium text-blue-500 underline transition hover:text-blue-600"
            >
              View biography
            </p>
            <div class="flex items-center space-x-2">
              <EditIcon
                @click="createEditTutorModal = true"
                class="h-4 w-4 cursor-pointer"
              />
              <DeleteIcon
                @click="deleteTutorModal = true"
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
            :src="selectedTutor.image"
            alt="Tutor"
            class="h-80 rounded-t-lg transition hover:opacity-80"
          />
          <p  @click="createEditTutorModal = true" class="mt-2 cursor-pointer text-sm text-gray-400 underline">
            Click to change picture
          </p>
        </div>

        <!-- Tutor Info -->
        <div class="mt-4">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ selectedTutor.name }}
          </h2>
          <p class="mt-1 text-gray-500">Subject: {{ selectedTutor.subject }}</p>
        </div>

        <!-- Biography -->
        <div class="mt-4 py-3">
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-300">
            Biography
          </h3>
          <p
            class="mt-2 max-h-40 overflow-auto text-sm text-gray-600 dark:text-gray-400"
          >
            {{ selectedTutor.bio }}
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

          <!-- Schedule Meeting Button -->
          <button
            class="ml-3 rounded-full p-2 text-gray-600 transition"
            @click="openCalendar"
          >
            <font-awesome-icon :icon="['fas', 'fa-calendar-alt']" />
          </button>

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
        <template #header>
          <h1 class="text-xl font-semibold">
            {{ isEditing ? 'Edit Tutor' : 'Add Tutor' }}
          </h1>
        </template>
        <!-- Profile Picture Upload -->
        <div class="flex flex-col items-center">
          <label for="file-upload" class="relative cursor-pointer">
            <img
              :src="profileImage || defaultProfileImage"
              class="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
              alt="Profile"
            />
            <input
              id="file-upload"
              type="file"
              class="hidden"
              @change="uploadImage"
            />
          </label>
          <p
            class="mt-2 cursor-pointer text-sm text-blue-600"
            @click="triggerFileUpload"
          >
            Click to upload picture
          </p>
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
            v-model="tutor.subjects"
            label="Subjects"
            placeholder="Enter subjects"
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
            v-model="tutor.biography"
            label="Biography"
            placeholder="Enter biography"
            variant="none"
            class="my-2 w-full rounded-lg border bg-white p-2 dark:border-none dark:bg-[#111C44]"
          />
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex justify-end space-x-2">
          <UButton
            color="gray"
            @click="closeCreateEditModal"
            variant="none"
            class="flex w-[130px] items-center justify-center rounded-md border border-[#5D3BEA] bg-white py-2 text-[#5D3BEA] transition hover:scale-105 hover:bg-gray-300"
            >Close modal</UButton
          >
          <UButton
            @click="saveTutor"
            class="flex w-[150px] items-center justify-center rounded-md bg-[#5D3BEA] py-2 text-white transition hover:scale-105 hover:bg-[#4A2DCA]"
            variant="none"
            >Add tutor</UButton
          >
        </div>
      </UCard>
    </UModal>

    <!-- Modal for deleting a tutor -->
    <UModal v-model="deleteTutorModal">
      <UCard class="p-6">
        <template #header>
          <h1 class="text-xl font-semibold">Delete Tutor</h1>
        </template>
        <p>
          Are you sure you want to delete this tutor? <br />
          Students will not be able to find this tutor anymore
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import EditIcon from '~/assets/icons/edit-icon.vue'
import DeleteIcon from '~/assets/icons/delete-icon.vue'
import { tutors } from '~/constants/tutors'

const createEditTutorModal = ref(false)
const deleteTutorModal = ref(false)
const showModal = ref(false)
const selectedTutor = ref({})
const searchQuery = ref('')
const chatMessages = ref([])
const newMessage = ref('')

const filteredTutors = computed(() => {
  return tutors.value.filter(tutor =>
    tutor.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openModal = tutor => {
  selectedTutor.value = tutor
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    chatMessages.value.push({ sender: 'user', text: newMessage.value })
    // Simulate tutor response
    setTimeout(() => {
      chatMessages.value.push({
        sender: 'tutor',
        text: 'Thank you for reaching out!'
      })
    }, 1000)
    newMessage.value = ''
  }
}

const tutor = ref({
  name: '',
  subjects: '',
  price: '',
  biography: ''
})
const profileImage = ref(null)
const defaultProfileImage =
  'https://cdn-icons-png.flaticon.com/512/929/929422.png'

const triggerFileUpload = () => document.getElementById('file-upload').click()

const uploadImage = event => {
  const file = event.target.files[0]
  if (file) profileImage.value = URL.createObjectURL(file)
}

const closeCreateEditModal = () => (createEditTutorModal.value = false)
const closeDeleteTutorModal = () => (deleteTutorModal.value = false)
const saveTutor = () => {
  console.log('Tutor saved:', tutor.value)
  closeCreateEditModal()
}

const deleteTutor = () => {
  console.log('Tutor deleted:', selectedTutor.value)
  closeDeleteTutorModal()
}
</script>

<style scoped>
.container {
  max-width: 1000px;
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
