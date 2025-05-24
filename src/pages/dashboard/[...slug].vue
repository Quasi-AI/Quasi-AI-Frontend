<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>

    <template #apps>
      <div
        class="mb-6 flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44] dark:text-white md:flex-row"
      >
        <div class="flex w-full items-center gap-4 md:w-auto">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-[#6366F1] text-lg font-bold text-white"
          >
            {{ initials }}
          </div>
          <div class="text-center md:text-left">
            <h2 class="text-lg font-semibold">{{ name }}</h2>
            <p class="text-sm text-gray-400">{{ email }}</p>
          </div>
        </div>
        <NuxtLink
          to="/apps"
          class="w-full rounded-md bg-[#6366F1] px-4 py-2 text-center text-white hover:bg-[#4F46E5] md:w-auto"
        >
          Go to Apps
        </NuxtLink>
      </div>

      <div
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
      >
        <template v-if="isLoading">
          <!-- Skeleton Loaders -->
          <div
            v-for="n in 4"
            :key="n"
            class="animate-pulse rounded-lg bg-gray-200 p-4"
          >
            <div class="h-6 w-32 rounded bg-gray-300"></div>
            <div class="mt-2 h-10 w-20 rounded bg-gray-300"></div>
            <div class="mt-2 h-4 w-16 rounded bg-gray-300"></div>
          </div>
        </template>

        <template v-else>
          <!-- Actual Cards -->
          <StatCard
            :title="card1.card_title"
            :value="card1.card_value"
            :trend="card1.card_trend"
            :trendColor="card1.card_trend_color"
            :svg="FlashcardSvg"
          />
          <StatCard
            :title="card2.card_title"
            :value="card2.card_value"
            :trend="card2.card_trend"
            :trendColor="card2.card_trend_color"
            :svg="QuestionSvg"
          />
          <StatCard
            :title="card3.card_title"
            :value="card3.card_value"
            :trend="card3.card_trend"
            :trendColor="card3.card_trend_color"
            :svg="TotalLearnersSvg"
          />
          <StatCard
            :title="card4.card_title"
            :value="card4.card_value"
            :trend="card4.card_trend"
            :trendColor="card4.card_trend_color"
            :svg="TutorsSvg"
          />
        </template>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="flex flex-col gap-6 lg:col-span-2">
          <div
            class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44] dark:text-white"
          >
            <div
              class="mb-4 flex flex-col items-center justify-between gap-4 lg:flex-row"
            >
              <h1 class="text-2xl font-medium">Learning Progress</h1>
              <div class="flex gap-4">
                <select
                  v-model="selectedStudent"
                  class="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 dark:border-[#0C1438] dark:bg-[#1E2A5A]"
                >
                  <option value="">Select Student</option>
                  <option
                    v-for="student in students"
                    :key="student.id"
                    :value="student.id"
                  >
                    {{ student.name }}
                  </option>
                </select>
                <select
                  v-model="selectedYear"
                  class="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 dark:border-[#0C1438] dark:bg-[#1E2A5A]"
                >
                  <option value="">Select Year</option>
                  <option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>
            <div class="h-[350px] w-full">
              <Line :key="chartKey" :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PieChart
              title="Users"
              :series="pieChartSeries"
              :chartOptions="pieChartOptions"
            />
            <div
              class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44] dark:text-white"
            >
              <h2 class="mb-4 text-lg font-semibold">Quiz Created vs Taken</h2>
              <div class="h-[350px] w-full">
                <Bar :data="quizBarData" :options="quizBarOptions" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex max-h-[880px] flex-col overflow-y-auto rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44] dark:text-white lg:row-span-2"
        >
          <h2 class="mb-4 text-lg font-semibold">Recent Flashcards</h2>
          <ul class="flex-1 overflow-y-auto">
            <template v-if="recentFlashcards?.length">
              <li
                v-for="(flashcard, index) in recentFlashcards"
                :key="index"
                class="flex items-center justify-between border-b border-gray-300 py-2 text-sm dark:border-gray-700"
              >
                <div class="flex items-center gap-2">
                  <TutorsSvg class="h-4 w-4 text-gray-500 dark:text-gray-300" />
                  <span>{{ flashcard.title }}</span>
                </div>
                <span class="text-xs text-gray-400 dark:text-gray-300">
                  {{ formatTimeAgo(flashcard.createdAt) }}
                </span>
              </li>
            </template>
            <div v-else class="mt-4 text-center text-gray-500">
              No Flashcard
              <EmptyStateIcon width="100%" height="350px" />
            </div>
          </ul>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'
import PieChart from '@/components/PieChart.vue'
import EmptyStateIcon from '@/assets/icons/empty-state-icon.vue'
import { ref, onMounted, watchEffect, computed, watch } from 'vue'
import axios from 'axios'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useDebounceFn } from '@vueuse/core'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ChartCard = defineAsyncComponent(
  () => import('@/components/ChartCard.vue')
)

const selectedStudent = ref('')
const selectedYear = ref('')

import { formatTimeAgo } from '@/utils/timeAgo.ts'

import QuestionSvg from '~/assets/icons/questionSvg.vue'
import FlashcardSvg from '~/assets/icons/flashcardSvg.vue'
import TotalLearnersSvg from '~/assets/icons/totallearnersSvg.vue'
import TutorsSvg from '~/assets/icons/tutorsSvg.vue'

const card1 = ref({})
const card2 = ref({})
const card3 = ref({})
const card4 = ref({})
const recentFlashcards = ref([])
const name = ref('')
const email = ref('')
const initials = ref('')
const studentCount = ref(0)
const educatorCount = ref(0)
const students = ref([])
const years = ref([])
const isLoading = ref(true)
const currentYear = new Date().getFullYear()
const chartSeries = ref([])
const quizChartSeries = ref([])

const fetchStats = async () => {
  try {
    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/dashboard',
      {
        role: sessionStorage.getItem('role'),
        user_id: sessionStorage.getItem('user_id')
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )

    const data = response.data
    card1.value = data[0]
    card2.value = data[1]
    card3.value = data[2]
    card4.value = data[3]
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchFlashCards = async () => {
  try {
    const response = await fetch(
      `https://dark-caldron-448714-u5.uc.r.appspot.com/flashcards/${sessionStorage.getItem(
        'user_id'
      )}`
    )

    if (!response.ok) throw new Error('Failed to fetch flashcards')

    const data = await response.json() // Parse JSON
    recentFlashcards.value = data.flashcards // Correct way to update ref
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

const fetchStudents = async () => {
  try {
    const response = await fetch(
      `https://dark-caldron-448714-u5.uc.r.appspot.com/educator-student/${sessionStorage.getItem(
        'user_id'
      )}`
    )

    if (!response.ok) throw new Error('Failed to fetch flashcards')

    const data = await response.json()
    students.value = data.users
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

const fetchUsersData = async () => {
  try {
    const studentResponse = await axios.get(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/students/'
    )
    const educatorResponse = await axios.get(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/educators/'
    )

    // Assign the fetched values to reactive variables
    studentCount.value = studentResponse.data.totalStudents
    educatorCount.value = educatorResponse.data.totalEducators
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

const chartKey = ref(0)
const isChartDataLoading = ref(true)

const fetchlineFlashcard = async () => {
  try {
    isChartDataLoading.value = true
    const response = await fetch(
      `https://dark-caldron-448714-u5.uc.r.appspot.com/flash-quiz/${sessionStorage.getItem(
        'user_id'
      )}`
    )

    if (!response.ok) throw new Error('Failed to fetch flashcards')

    const data = await response.json()
    chartSeries.value = data.data
    // Force chart re-render with a new key
    chartKey.value += 1
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    isChartDataLoading.value = false
  }
}

const fetchQuizzeTaken = async () => {
  try {
    const response = await fetch(
      `https://dark-caldron-448714-u5.uc.r.appspot.com/flash-quiz/${sessionStorage.getItem(
        'user_id'
      )}`
    )

    if (!response.ok) throw new Error('Failed to fetch quiz data')

    const data = await response.json()
    quizChartSeries.value = data.data
  } catch (error) {
    console.error('Failed to fetch quiz data:', error)
  }
}

// Computed property to update pie chart series reactively
const pieChartSeries = computed(() => [studentCount.value, educatorCount.value])

const pieChartOptions = computed(() => ({
  chart: { type: 'donut' },
  labels: ['Students', 'Educators'],
  colors: ['#EF4444', '#6366F1'],
  legend: { show: false },
  dataLabels: { enabled: false }
}))

const quizBarData = computed(() => ({
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  datasets: [
    {
      label: 'Quizzes Created',
      data: quizChartSeries.value[0]?.data || Array(12).fill(0),
      backgroundColor: '#6366F1',
      borderRadius: 4,
      maxBarThickness: 20
    },
    {
      label: 'Quizzes Taken',
      data: quizChartSeries.value[1]?.data || Array(12).fill(0),
      backgroundColor: '#10B981',
      borderRadius: 4,
      maxBarThickness: 20
    }
  ]
}))

const quizBarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 500
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        boxWidth: 10,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 10,
      displayColors: true,
      usePointStyle: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#e5e7eb',
        drawBorder: false,
        drawTicks: false
      },
      ticks: {
        padding: 10,
        font: {
          size: 11
        }
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        padding: 10,
        font: {
          size: 11
        }
      },
      border: {
        display: false
      }
    }
  }
}))

onMounted(async () => {
  // Get session data efficiently
  const storedName = sessionStorage.getItem('name') || 'Default Name'
  const storedEmail = sessionStorage.getItem('email') || 'default@example.com'

  // Assign values
  name.value = storedName
  email.value = storedEmail

  // Generate initials efficiently
  const words = storedName.trim().split(' ')
  initials.value =
    words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase()

  // Run API calls concurrently for faster execution
  await Promise.all([
    fetchStats(),
    fetchFlashCards(),
    fetchUsersData(),
    fetchStudents(),
    fetchlineFlashcard(),
    fetchQuizzeTaken()
  ])
})

// Initialize the array dynamically up to the current year
for (let year = 2025; year <= currentYear; year++) {
  years.value.push(year)
}

// Watch for year changes and update array if needed
watchEffect(() => {
  const newYear = new Date().getFullYear()
  if (!years.value.includes(newYear)) {
    years.value.push(newYear) // Append the new year
  }
})

// Replace chartSeries and chartOptions with chartData
const chartData = computed(() => ({
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  datasets: [
    {
      label: 'Flashcards Created',
      data: chartSeries.value[0]?.data || Array(12).fill(0),
      borderColor: '#FF6636',
      backgroundColor: '#FF6636',
      tension: 0.1,
      fill: false,
      pointBackgroundColor: '#FF6636',
      pointBorderColor: '#FF6636',
      pointRadius: 3,
      pointHoverRadius: 3,
      pointBorderWidth: 2,
      borderWidth: 2
    },
    {
      label: 'Quizzes Taken',
      data: chartSeries.value[1]?.data || Array(12).fill(0),
      borderColor: '#1E2A5A',
      backgroundColor: '#1E2A5A',
      tension: 0.1,
      fill: false,
      pointBackgroundColor: '#1E2A5A',
      pointBorderColor: '#1E2A5A',
      pointRadius: 3,
      pointHoverRadius: 3,
      pointBorderWidth: 2,
      borderWidth: 2
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false, // Disable all animations
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        boxWidth: 10,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 10,
      displayColors: true,
      usePointStyle: true,
      callbacks: {
        label: context => ` ${context.dataset.label}: ${context.parsed.y}`
      }
    }
  },
  // Stabilize rendering by limiting redraws
  resizeDelay: 200,
  hover: {
    mode: 'nearest',
    intersect: false,
    axis: 'x',
    animationDuration: 0
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#e5e7eb',
        drawBorder: false,
        drawTicks: false
      },
      ticks: {
        padding: 10,
        stepSize: 5,
        font: {
          size: 11
        }
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        padding: 10,
        font: {
          size: 11
        }
      },
      border: {
        display: false
      }
    }
  },
  transitions: {
    active: {
      animation: {
        duration: 0 // Disable transition animations
      }
    }
  }
}))

// Replace with a more robust update function
const updateChartData = async () => {
  try {
    isChartDataLoading.value = true
    const params = new URLSearchParams()

    if (selectedStudent.value) {
      params.append('student_id', selectedStudent.value)
    }

    if (selectedYear.value) {
      params.append('year', selectedYear.value)
    }

    const url = `https://dark-caldron-448714-u5.uc.r.appspot.com/flash-quiz/${sessionStorage.getItem('user_id')}?${params}`
    const response = await fetch(url)

    if (!response.ok) throw new Error('Failed to fetch chart data')

    const data = await response.json()
    chartSeries.value = data.data

    // Force chart re-render
    chartKey.value += 1
  } catch (error) {
    console.error('Error updating chart data:', error)
  } finally {
    isChartDataLoading.value = false
  }
}

// Watch for changes that should trigger chart updates
watch(
  [selectedStudent, selectedYear],
  () => {
    updateChartData()
  },
  { deep: true }
)
</script>

<style scoped>
.dark-bg {
  background-color: #111c44;
}
</style>
