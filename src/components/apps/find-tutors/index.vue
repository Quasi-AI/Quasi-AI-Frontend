<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-6">Tutors</h1>

    <!-- Create Tutor & Search Bar -->
    <div class="flex justify-between items-center mb-6">
      <button class="px-4 py-2 bg-[#5D3BE9] text-white rounded-lg" @click="openCreateModal">
        Create Tutor
      </button>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by subject..."
        class="px-4 py-2 border rounded-lg w-1/3"
      />
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="tutor in filteredTutors"
        :key="tutor.id"
        class="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
        @click="openModal(tutor)"
      >
        <img :src="tutor.image" alt="Tutor Image" class="w-24 h-24 mx-auto rounded-full border-4 border-gray-300" />
        <h2 class="text-lg font-semibold text-center mt-3">{{ tutor.name }}</h2>
        <p class="text-center text-gray-600">Teaches: {{ tutor.subject }}</p>
        <p class="text-center text-gray-500">Experience: {{ tutor.experience }} years</p>

        <!-- Star Rating -->
        <div class="flex justify-center mt-2">
          <span v-for="star in 5" :key="star" class="text-yellow-500">
            {{ star <= tutor.rating ? "★" : "☆" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" @click="closeModal">&times;</button>

        <img :src="selectedTutor.image" alt="Tutor Image" class="w-32 h-32 mx-auto rounded-full border-4 border-gray-300" />
        <h2 class="text-2xl font-bold text-center mt-3">{{ selectedTutor.name }}</h2>
        <p class="text-center text-gray-600">Teaches: {{ selectedTutor.subject }}</p>
        <p class="text-center text-gray-500">Experience: {{ selectedTutor.experience }} years</p>
        <p class="text-center text-gray-700 mt-4">{{ selectedTutor.bio }}</p>

        <!-- Star Rating in Modal -->
        <div class="flex justify-center mt-2">
          <span v-for="star in 5" :key="star" class="text-yellow-500">
            {{ star <= selectedTutor.rating ? "★" : "☆" }}
          </span>
        </div>

        <!-- Create Tutor Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" @click="closeCreateModal">&times;</button>

            <!-- Profile Image -->
            <div class="flex justify-center mb-4">
              <label class="relative cursor-pointer">
                <input type="file" class="hidden" @change="uploadImage" />
                <img 
                  :src="newTutor.image || 'https://via.placeholder.com/100'"
                  class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  alt="Tutor Profile"
                />
                <span class="absolute bottom-0 right-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">📷</span>
              </label>
            </div>

            <h2 class="text-2xl font-bold text-center mb-4">Create Tutor</h2>

            <div class="mb-2">
              <label class="block font-semibold">Name:</label>
              <input v-model="newTutor.name" type="text" class="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div class="mb-2">
              <label class="block font-semibold">Subject:</label>
              <input v-model="newTutor.subject" type="text" class="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div class="mb-2">
              <label class="block font-semibold">Experience (years):</label>
              <input v-model="newTutor.experience" type="number" class="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div class="mb-2">
              <label class="block font-semibold">Rating (1-5):</label>
              <input v-model="newTutor.rating" type="number" min="1" max="5" class="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div class="mb-2">
              <label class="block font-semibold">Bio:</label>
              <textarea v-model="newTutor.bio" class="w-full px-3 py-2 border rounded-lg"></textarea>
            </div>

            <div class="mt-4 flex justify-center">
              <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="addTutor">
                Save Tutor
              </button>

              <button class="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700" @click="closeCreateModal">
                Cancel
              </button>
            </div>
          </div>
        </div>


        <div class="mt-4 flex justify-center">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="openChat">
            Chat
          </button>
          <button class="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div
    v-if="showChat"
    class="fixed bottom-5 right-5 w-96 h-[400px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden border border-gray-300"
  >
    <!-- Chat Header -->
    <div class="flex justify-between items-center bg-[#5D3BE9] text-white px-4 py-3">
      <h3 class="text-lg font-semibold">Chat with {{ selectedTutor.name }}</h3>
      <button class="text-white text-2xl hover:opacity-80" @click="closeChat">&times;</button>
    </div>

    <!-- Chat Messages -->
    <div class="flex flex-col flex-grow overflow-y-auto p-4 space-y-2">
      <div v-for="(msg, index) in chatMessages" :key="index" class="flex w-full">
        <div
          :class="{
            'ml-auto bg-[#5D3BE9] text-white': msg.sender === 'user',
            'mr-auto bg-gray-200 text-black': msg.sender === 'tutor'
          }"
          class="px-4 py-2 rounded-lg max-w-[80%]"
        >
          {{ msg.text }}
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="flex items-center p-3 bg-gray-100 border-t border-gray-300">
      <!-- Message Input -->
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type a message..."
        class="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D3BE9]"
        @keyup.enter="sendMessage"
      />

      <!-- Schedule Meeting Button -->
      <button
        class="ml-3 p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition"
        @click="openCalendar"
      >
      <font-awesome-icon :icon="['fas', 'fa-calendar-alt']" />
      </button>

      <!-- Video Call Button (Using FontAwesome) -->
      <button
        class="ml-3 p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition"
        @click="startVideoCall"
      >
      <font-awesome-icon :icon="['fas', 'fa-video']" />
      </button>

      <!-- Send Message Button -->
      <button
        class="ml-3 p-2 bg-[#5D3BE9] text-white rounded-full hover:bg-[#4c32c9] transition"
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
import { ref, computed } from 'vue';





const tutors = ref([
  {
    id: 1,
    name: "John Doe",
    subject: "Mathematics",
    experience: 5,
    rating: 4,
    bio: "Passionate math tutor with 5 years of experience helping students excel in algebra and calculus.",
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    name: "Jane Smith",
    subject: "English",
    experience: 8,
    rating: 5,
    bio: "English teacher specializing in literature and writing skills. Dedicated to improving student confidence.",
    image: "https://randomuser.me/api/portraits/women/2.jpg"
  }
]);

const showModal = ref(false);
const selectedTutor = ref({});
const searchQuery = ref("");
const showCreateModal = ref(false);
// Chat Functionality
const showChat = ref(false);
const chatMessages = ref([]);
const newMessage = ref("");


const newTutor = ref({ name: "", subject: "", experience: "", rating: "", bio: "", image: "" });

const filteredTutors = computed(() => {
  return tutors.value.filter(tutor =>
    tutor.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const openModal = (tutor) => {
  selectedTutor.value = tutor;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const openCreateModal = () => {
  selectedTutor.value = tutor;
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

// Add New Tutor
const addTutor = () => {
  if (!newTutor.value.name || !newTutor.value.subject || !newTutor.value.image) {
    alert("Please fill in all required fields.");
    return;
  }

  tutors.value.push({
    id: tutors.value.length + 1, // Assign a new unique ID
    ...newTutor.value,
    experience: parseInt(newTutor.value.experience, 10) || 0, 
    rating: parseInt(newTutor.value.rating, 10) || 0
  });

  // Clear the form and close the modal
  newTutor.value = { name: "", subject: "", experience: "", rating: "", bio: "", image: "" };
  closeCreateModal();
};


const openChat = () => {
  showChat.value = true;
};

const closeChat = () => {
  showChat.value = false;
  chatMessages.value = [];
};

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    chatMessages.value.push({ sender: "user", text: newMessage.value });
    // Simulate tutor response
    setTimeout(() => {
      chatMessages.value.push({ sender: "tutor", text: "Thank you for reaching out!" });
    }, 1000);
    newMessage.value = "";
  }
};
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
  background: #5D3BE9;
  border-radius: 10px;
}
</style>
