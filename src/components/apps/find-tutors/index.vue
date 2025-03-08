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
        class="bg-gray-white my-2 w-full lg:w-[350px] rounded-lg p-2 dark:bg-[#111C44]"
      />

      <button
        class="mr-4 rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        @click="openCreateModal"
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
        class="cursor-pointer rounded-lg bg-white transition hover:shadow-xl dark:bg-[#111C44]"
      >
        <img
          :src="tutor.image"
          alt="Tutor"
          class="h-80 lg:h-40 w-full rounded-t-lg object-cover"
        />
        <div class="p-2">
          <h2 class="mt-3 text-lg font-semibold">{{ tutor.name }}</h2>
          <p class="text-gray-500">{{ tutor.subject }}</p>

          <div class="mt-6 flex items-center justify-between">
            <p
              @click="openModal(tutor)"
              class="truncate text-xs text-blue-500 underline transition hover:text-blue-600"
            >
              View biography
            </p>
            <div class="flex items-center space-x-2">
              <EditIcon />
              <DeleteIcon />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-end overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div
        class="relative h-full max-h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl dark:bg-[#111C44]"
      >
        <!-- Close Button -->
        <button
          class="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700"
          @click="closeModal"
        >
          &times;
        </button>

        <!-- Profile Image -->
        <div class="flex flex-col items-center">
          <img
            :src="selectedTutor.image"
            alt="Tutor"
            class="h-80 rounded-t-lg transition hover:opacity-80"
          />
          <p class="mt-2 cursor-pointer text-sm hover:underline">
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
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-300">
            Biography
          </h3>
          <p
            class="mt-2 max-h-40 overflow-auto text-sm text-gray-600 dark:text-gray-400"
          >
            {{ selectedTutor.bio }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="mb-20 mt-6 flex justify-center space-x-3 lg:mb-0">
          <button
            class="hidden rounded-full bg-blue-600 px-16 py-2 text-white transition hover:bg-blue-700 lg:flex"
            @click="openChat"
          >
            Chat
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div
      v-if="showChat"
      class="fixed bottom-5 right-5 flex h-[400px] w-96 flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-[#111C44]"
    >
      <!-- Chat Header -->
      <div
        class="flex items-center justify-between bg-[#5D3BE9] px-4 py-3 text-white"
      >
        <h3 class="text-lg font-semibold">
          Chat with {{ selectedTutor.name }}
        </h3>
        <button class="text-2xl text-white hover:opacity-80" @click="closeChat">
          &times;
        </button>
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
              'mr-auto bg-gray-200 text-black': msg.sender === 'tutor'
            }"
            class="max-w-[80%] rounded-lg px-4 py-2"
          >
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="flex items-center bg-white p-3 dark:bg-[#0C1438]">
        <!-- Message Input -->
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message..."
          class="my-2 flex-grow rounded-full bg-gray-200 p-2 dark:bg-[#111C44]"
          @keyup.enter="sendMessage"
        />

        <!-- Schedule Meeting Button -->
        <button
          class="ml-3 rounded-full p-2 text-gray-600 transition"
          @click="openCalendar"
        >
          <font-awesome-icon :icon="['fas', 'fa-calendar-alt']" />
        </button>

        <!-- Video Call Button (Using FontAwesome) -->
        <button
          class="ml-3 rounded-full p-2 text-gray-600 transition"
          @click="startVideoCall"
        >
          <font-awesome-icon :icon="['fas', 'fa-video']" />
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
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import EditIcon from '~/assets/icons/edit-icon.vue'
import DeleteIcon from '~/assets/icons/delete-icon.vue'

const tutors = ref([
  {
    id: 1,
    name: 'John Doe',
    subject: 'Mathematics',
    experience: 5,
    rating: 4,
    bio: 'Passionate math tutor with 5 years of experience helping students excel in algebra and calculus.',
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    subject: 'English',
    experience: 8,
    rating: 5,
    bio: 'English teacher specializing in literature and writing skills. Dedicated to improving student confidence.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    subject: 'Physics',
    experience: 6,
    rating: 4,
    bio: 'Experienced physics tutor with a focus on mechanics and electromagnetism.',
    image: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 4,
    name: 'Emily Davis',
    subject: 'Chemistry',
    experience: 7,
    rating: 5,
    bio: 'Chemistry tutor with a passion for organic chemistry and laboratory techniques.',
    image: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 5,
    name: 'David Wilson',
    subject: 'Biology',
    experience: 4,
    rating: 4,
    bio: 'Biology tutor specializing in genetics and molecular biology.',
    image: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: 6,
    name: 'Sarah Brown',
    subject: 'History',
    experience: 9,
    rating: 5,
    bio: 'History tutor with expertise in world history and historical research methods.',
    image: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: 7,
    name: 'James Miller',
    subject: 'Computer Science',
    experience: 5,
    rating: 4,
    bio: 'Computer science tutor with a focus on programming and algorithms.',
    image: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  {
    id: 8,
    name: 'Laura Garcia',
    subject: 'Spanish',
    experience: 10,
    rating: 5,
    bio: 'Spanish tutor with extensive experience in language instruction and cultural studies.',
    image: 'https://randomuser.me/api/portraits/women/8.jpg'
  },
  {
    id: 9,
    name: 'Robert Martinez',
    subject: 'Economics',
    experience: 6,
    rating: 4,
    bio: 'Economics tutor with a focus on microeconomics and macroeconomic theory.',
    image: 'https://randomuser.me/api/portraits/men/9.jpg'
  },
  {
    id: 10,
    name: 'Linda Hernandez',
    subject: 'Art',
    experience: 7,
    rating: 5,
    bio: 'Art tutor specializing in drawing, painting, and art history.',
    image: 'https://randomuser.me/api/portraits/women/10.jpg'
  }
])

const showModal = ref(false)
const selectedTutor = ref({})
const searchQuery = ref('')
const showCreateModal = ref(false)
// Chat Functionality
const showChat = ref(false)
const chatMessages = ref([])
const newMessage = ref('')

const newTutor = ref({
  name: '',
  subject: '',
  experience: '',
  rating: '',
  bio: '',
  image: ''
})

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

const openCreateModal = () => {
  selectedTutor.value = tutor
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

// Add New Tutor
const addTutor = () => {
  if (
    !newTutor.value.name ||
    !newTutor.value.subject ||
    !newTutor.value.image
  ) {
    alert('Please fill in all required fields.')
    return
  }

  tutors.value.push({
    id: tutors.value.length + 1, // Assign a new unique ID
    ...newTutor.value,
    experience: parseInt(newTutor.value.experience, 10) || 0,
    rating: parseInt(newTutor.value.rating, 10) || 0
  })

  // Clear the form and close the modal
  newTutor.value = {
    name: '',
    subject: '',
    experience: '',
    rating: '',
    bio: '',
    image: ''
  }
  closeCreateModal()
}

const openChat = () => {
  showChat.value = true
}

const closeChat = () => {
  showChat.value = false
  chatMessages.value = []
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
