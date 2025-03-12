<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>

    <template #apps>
      <div
        class="mb-6 flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-6 shadow-sm md:flex-row dark:bg-[#111C44] dark:text-white"
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
        <StatCard
          title="Total Flashcards"
          value="189"
          trend="0.5% Down"
          trendColor="text-red-500 dark:text-red-400"
          :svg="FlashcardSvg"
        />
        <StatCard
          title="Total Questions"
          value="40"
          trend="8.5% Up"
          trendColor="text-green-500 dark:text-green-400"
          :svg="QuestionSvg"
        />
        <StatCard
          title="Total Learners"
          value="46"
          trend="8.5% Up"
          trendColor="text-green-500 dark:text-green-400"
          :svg="TotalLearnersSvg"
        />
        <StatCard
          title="No. of Tutors"
          value="90"
          trend="8.5% Up"
          trendColor="text-green-500 dark:text-green-400"
          :svg="TutorsSvg"
        />
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
            <VueApexCharts
              type="line"
              :options="chartOptions"
              :series="chartSeries"
              height="350"
            />
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PieChart
              title="Users"
              :series="pieChartSeries"
              :chartOptions="pieChartOptions"
            />
            <ChartCard
              title="Quiz Created vs Taken"
              :chartOptions="quizChartOptions"
              :series="quizChartSeries"
            />
          </div>
        </div>

        <div
          class="flex max-h-[880px] flex-col overflow-y-auto rounded-lg bg-white p-6 shadow-sm lg:row-span-2 dark:bg-[#111C44] dark:text-white"
        >
          <h2 class="mb-4 text-lg font-semibold">Recent Flashcards</h2>
          <ul class="flex-1 overflow-y-auto">
            <li
              v-for="(flashcard, index) in recentFlashcards"
              :key="index"
              class="flex items-center justify-between border-b border-gray-300 py-2 text-sm dark:border-gray-700"
            >
              <div class="flex items-center gap-2">
                <TutorsSvg class="h-4 w-4 text-gray-500 dark:text-gray-300" />
                <span>{{ flashcard.title }}</span>
              </div>
              <span class="text-xs text-gray-400 dark:text-gray-300">{{
                flashcard.time
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'
import PieChart from '@/components/PieChart.vue'
const ChartCard = defineAsyncComponent(
  () => import('@/components/ChartCard.vue')
)
const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))
const selectedStudent = ref('')
const selectedYear = ref('')

import QuestionSvg from '@/components/icons/questionSvg.vue'
import FlashcardSvg from '@/components/icons/flashcardSvg.vue'
import TotalLearnersSvg from '@/components/icons/totallearnersSvg.vue'
import TutorsSvg from '@/components/icons/tutorsSvg.vue'

const name = ref('')
const email = ref('')
const initials = ref('')

const students = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' }
])

const years = ref([2021, 2022, 2023, 2024])

const chartOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false } },
  stroke: { curve: 'smooth', width: 2 },
  tooltip: { enabled: true },
  xaxis: {
    categories: [
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
    ]
  },
  colors: ['#FF6636', '#1E2A5A'],
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  }
}))

const chartSeries = [
  {
    name: 'Quizzes taken',
    data: [5, 34, 17, 77, 85, 45, 2, 5, 26, 33, 121, 93]
  },
  {
    name: 'Flashcards created',
    data: [90, 44, 31, 12, 5, 32, 42, 12, 11, 32, 165, 54]
  }
]

const pieChartOptions = computed(() => ({
  chart: { type: 'donut' },
  labels: ['Educators', 'Learners'],
  colors: ['#EF4444', '#6366F1'],
  legend: { show: false },
  dataLabels: { enabled: false }
}))

const pieChartSeries = [12, 230] // Educators & Learners

const quizChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  xaxis: {
    categories: [
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
    labels: { style: { colors: '#6B7280', fontSize: '12px' } } // Improve readability
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4 // Rounded corners
    }
  },
  colors: ['#4F46E5', '#22C55E'], // Blue for Created, Green for Taken
  dataLabels: { enabled: false }, // Hide labels for cleaner UI
  grid: { borderColor: '#E5E7EB', strokeDashArray: 3 }, // Light grid lines
  tooltip: { theme: 'dark' }, // Dark mode tooltip
  legend: {
    position: 'top',
    labels: { colors: '#374151' } // Improve legend text visibility
  }
}))

const quizChartSeries = [
  {
    name: 'Created',
    data: [50, 100, 75, 200, 175, 150, 125, 140, 160, 190, 220, 250]
  },
  {
    name: 'Taken',
    data: [40, 80, 60, 180, 160, 140, 120, 130, 150, 180, 200, 230]
  }
]

const recentFlashcards = ref([
  { title: 'Generated Flashcard - Biology Chapter 3', time: '2 mins ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '3 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '6 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '10 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '12 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' },
  { title: 'Generated Flashcard - Biology Chapter 3', time: '24 hours ago' }
])

onMounted(() => {
  name.value = localStorage.getItem('name') || 'Default Name'
  email.value = localStorage.getItem('email') || 'default@example.com'

  const words = name.value.trim().split(' ')
  initials.value =
    words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase()
})
</script>

<style scoped>
.dark-bg {
  background-color: #111c44;
}
</style>
