<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-[#111C44]"
    >
      <!-- Modal Header -->
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Share with students
        </h2>
        <button
          @click="closeModal"
          class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Select Field -->
      <div class="mb-4">
        <label class="mb-2 block text-gray-700 dark:text-gray-200"
          >Students</label
        >
        <div
          class="relative flex flex-wrap items-center gap-2 rounded-lg bg-gray-100 p-2"
        >
          <span
            v-for="(student, index) in displayedSelectedStudents"
            :key="index"
            class="flex items-center rounded-md bg-white px-3 py-1 text-gray-700 shadow"
          >
            {{ student.name }}
            <button
              @click="removeStudent(student.id)"
              class="ml-2 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </span>
          <span v-if="selectedStudents.length > 2" class="text-gray-500"
            >+{{ selectedStudents.length - 2 }}</span
          >
          <button @click="toggleDropdown" class="ml-auto text-gray-600">
            ▼
          </button>
        </div>
        <div
          v-if="dropdownOpen"
          class="absolute mt-1 max-h-60 max-w-md overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg"
        >
          <div
            v-for="student in students"
            :key="student.id"
            @click="toggleStudentSelection(student)"
            class="flex cursor-pointer items-center p-2 hover:bg-gray-100"
          >
            <input
              type="checkbox"
              class="mr-2"
              :checked="isSelected(student.id)"
            />
            {{ student.name }}
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-4">
        <button
          @click="closeModal"
          class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
        >
          Close
        </button>
        <button
          @click="shareWithStudents"
          class="rounded-lg bg-[#5D3BEA] px-4 py-2 text-white hover:bg-[#4A2DCA]"
        >
          Share with students
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'

// Props
const props = defineProps({
  isVisible: Boolean,
  type: String, // Passed from usage
  assignmentId: String // Passed from usage
})

// Emits
const emit = defineEmits(['close', 'share'])

// State
const students = ref([])
const selectedStudents = ref([])
const dropdownOpen = ref(false)
const educatorId = localStorage.getItem('user_id') // Get from localStorage

// Fetch students from API
// Fetch students from API
const fetchStudents = async () => {
  try {
    const response = await axios.get(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/students'
    )
    students.value = response.data.data.map(({ id, name }) => ({ id, name }))
  } catch (error) {
    console.error('Error fetching students:', error)
  }
}

onMounted(fetchStudents)

// Toggle dropdown
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

// Toggle student selection
const toggleStudentSelection = student => {
  const index = selectedStudents.value.findIndex(s => s.id === student.id)
  if (index === -1) {
    selectedStudents.value.push(student)
  } else {
    selectedStudents.value.splice(index, 1)
  }
}

// Check if student is selected
const isSelected = id => selectedStudents.value.some(s => s.id === id)

// Remove student from selection
const removeStudent = id => {
  selectedStudents.value = selectedStudents.value.filter(s => s.id !== id)
}

// Display only first 4 students
const displayedSelectedStudents = computed(() =>
  selectedStudents.value.slice(0, 2)
)

// Close modal
const closeModal = () => {
  emit('close')
}

// Share students
const shareWithStudents = async () => {
  const payload = {
    user_id: selectedStudents.value.map(s => s.id),
    educator_id: educatorId,
    type: props.type,
    assignment_id: props.assignmentId
  }

  try {
    await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/share',
      payload
    )
    emit('share', selectedStudents.value)
    closeModal()
  } catch (error) {
    console.error('Error sharing with students:', error)
  }
}
</script>
