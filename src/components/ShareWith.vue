<template>
  <Transition name="modal" appear>
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <Transition name="modal-inner" appear>
        <div
          class="w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all dark:bg-[#111C44]"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Share with students
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select students to share this {{ props.type }} with
              </p>
            </div>
            <button
              @click="closeModal"
              class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#1E2A5A] dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
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
          <div class="mb-6">
            <label
              class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Select students
            </label>
            <div
              class="relative min-h-[48px] cursor-pointer rounded-lg border-2 border-gray-200 bg-gray-50 p-3 transition-colors focus-within:border-[#5D3BEA] hover:border-gray-300 dark:border-gray-600 dark:bg-[#1E2A5A] dark:hover:border-gray-500"
              @click="toggleDropdown"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span
                  v-for="(student, index) in displayedSelectedStudents"
                  :key="student.id"
                  class="animate-in fade-in slide-in-from-left-2 flex items-center rounded-lg bg-[#5D3BEA] px-3 py-1.5 text-sm text-white shadow-sm transition-all duration-200 hover:bg-[#4A2DCA]"
                >
                  {{ student.name }}
                  <button
                    @click.stop="removeStudent(student.id)"
                    class="ml-2 rounded-full text-white transition-colors hover:bg-white hover:bg-opacity-20"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
                      />
                    </svg>
                  </button>
                </span>
                <span
                  v-if="selectedStudents.length > 2"
                  class="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  +{{ selectedStudents.length - 2 }} more
                </span>
                <span
                  v-if="selectedStudents.length === 0"
                  class="text-gray-500 dark:text-gray-400"
                >
                  Click to select students...
                </span>
              </div>
              <div class="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  class="h-5 w-5 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': dropdownOpen }"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </div>
            </div>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="dropdownOpen"
                class="absolute z-10 mt-2 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-[#111C44] dark:ring-gray-700"
              >
                <!-- Search Input -->
                <div class="border-b border-gray-100 p-3 dark:border-gray-700">
                  <div class="relative">
                    <svg
                      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      />
                    </svg>
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search students..."
                      class="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-[#5D3BEA] focus:outline-none focus:ring-2 focus:ring-[#5D3BEA] focus:ring-opacity-20 dark:border-gray-600 dark:bg-[#1E2A5A] dark:text-white"
                      @click.stop
                    />
                  </div>
                </div>

                <!-- Students List -->
                <div class="max-h-60 overflow-auto">
                  <div
                    v-if="isLoading"
                    class="flex items-center justify-center p-8"
                  >
                    <div
                      class="h-6 w-6 animate-spin rounded-full border-2 border-[#5D3BEA] border-t-transparent"
                    ></div>
                    <span class="ml-2 text-sm text-gray-500"
                      >Loading students...</span
                    >
                  </div>

                  <div
                    v-else-if="filteredStudents.length === 0"
                    class="p-4 text-center text-gray-500"
                  >
                    No students found
                  </div>

                  <div
                    v-else
                    v-for="student in filteredStudents"
                    :key="student.id"
                    @click="toggleStudentSelection(student)"
                    class="flex cursor-pointer items-center p-3 transition-colors hover:bg-gray-50 dark:hover:bg-[#1E2A5A]"
                  >
                    <div class="relative">
                      <input
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-[#5D3BEA] focus:ring-[#5D3BEA] focus:ring-opacity-25"
                        :checked="isSelected(student.id)"
                        @click.stop
                      />
                    </div>
                    <span class="ml-3 text-sm text-gray-700 dark:text-gray-200">
                      {{ student.name }}
                    </span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Selected Count -->
          <div
            v-if="selectedStudents.length > 0"
            class="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900 dark:bg-opacity-20"
          >
            <p class="text-sm text-blue-700 dark:text-blue-300">
              {{ selectedStudents.length }} student{{
                selectedStudents.length !== 1 ? 's' : ''
              }}
              selected
            </p>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3">
            <button
              @click="closeModal"
              class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#1E2A5A]"
            >
              Cancel
            </button>
            <button
              @click="shareWithStudents"
              :disabled="selectedStudents.length === 0 || isSharing"
              class="relative rounded-lg bg-[#5D3BEA] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#4A2DCA] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span v-if="!isSharing">Share with students</span>
              <span v-else class="flex items-center">
                <div
                  class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                ></div>
                Sharing...
              </span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
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
const searchQuery = ref('')
const isLoading = ref(false)
const isSharing = ref(false)
const educatorId = sessionStorage.getItem('user_id')

// Fetch students from API
const fetchStudents = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/students'
    )
    students.value = response.data.data.map(({ id, name }) => ({ id, name }))
  } catch (error) {
    console.error('Error fetching students:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchStudents)

// Computed: Filter students based on search query
const filteredStudents = computed(() => {
  return students.value
    .filter(
      student =>
        student.name &&
        student.name.trim() !== '' &&
        student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name))
})

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

// Display only first 2 students
const displayedSelectedStudents = computed(() =>
  selectedStudents.value.slice(0, 2)
)

// Close modal
const closeModal = () => {
  dropdownOpen.value = false
  emit('close')
}

// Share students
const shareWithStudents = async () => {
  if (selectedStudents.value.length === 0) return

  isSharing.value = true
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
  } finally {
    isSharing.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-inner-enter-active,
.modal-inner-leave-active {
  transition: all 0.3s ease;
}
.modal-inner-enter-from,
.modal-inner-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
