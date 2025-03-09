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
              <EditIcon class="h-4 w-4 cursor-pointer" />
              <DeleteIcon class="h-4 w-4 cursor-pointer" />
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
          <p class="mt-2 cursor-pointer text-sm text-gray-400 underline">
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
  },
  {
    id: 11,
    name: 'William Taylor',
    subject: 'Geography',
    experience: 5,
    rating: 4,
    bio: 'Geography tutor with a focus on physical geography and environmental studies.',
    image: 'https://randomuser.me/api/portraits/men/11.jpg'
  },
  {
    id: 12,
    name: 'Sophia Anderson',
    subject: 'French',
    experience: 6,
    rating: 5,
    bio: 'French tutor specializing in language proficiency and cultural immersion.',
    image: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    id: 13,
    name: 'Daniel Thomas',
    subject: 'Statistics',
    experience: 7,
    rating: 4,
    bio: 'Statistics tutor with expertise in data analysis and probability.',
    image: 'https://randomuser.me/api/portraits/men/13.jpg'
  },
  {
    id: 14,
    name: 'Olivia Jackson',
    subject: 'Psychology',
    experience: 8,
    rating: 5,
    bio: 'Psychology tutor with a focus on cognitive and developmental psychology.',
    image: 'https://randomuser.me/api/portraits/women/14.jpg'
  },
  {
    id: 15,
    name: 'Matthew White',
    subject: 'Philosophy',
    experience: 5,
    rating: 4,
    bio: 'Philosophy tutor specializing in ethics and classical philosophy.',
    image: 'https://randomuser.me/api/portraits/men/15.jpg'
  },
  {
    id: 16,
    name: 'Ava Harris',
    subject: 'Music',
    experience: 9,
    rating: 5,
    bio: 'Music tutor with expertise in music theory and piano performance.',
    image: 'https://randomuser.me/api/portraits/women/16.jpg'
  },
  {
    id: 17,
    name: 'Josephine Clark',
    subject: 'Political Science',
    experience: 6,
    rating: 4,
    bio: 'Political science tutor with a focus on international relations and political theory.',
    image: 'https://randomuser.me/api/portraits/women/17.jpg'
  },
  {
    id: 18,
    name: 'Mia Lewis',
    subject: 'Sociology',
    experience: 7,
    rating: 5,
    bio: 'Sociology tutor specializing in social theory and research methods.',
    image: 'https://randomuser.me/api/portraits/women/18.jpg'
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
