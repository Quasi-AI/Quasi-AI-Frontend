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
import { ref, onMounted } from "vue";
import axios from "axios";
const ChartCard = defineAsyncComponent(
  () => import('@/components/ChartCard.vue')
)
const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))
const selectedStudent = ref('')
const selectedYear = ref('')

import { formatTimeAgo } from '@/utils/timeAgo.ts';

import QuestionSvg from '@/components/icons/questionSvg.vue'
import FlashcardSvg from '@/components/icons/flashcardSvg.vue'
import TotalLearnersSvg from '@/components/icons/totallearnersSvg.vue'
import TutorsSvg from '@/components/icons/tutorsSvg.vue'

const card1 = ref({});
const card2 = ref({});
const card3 = ref({});
const card4 = ref({});
const recentFlashcards = ref([]);
const name = ref('')
const email = ref('')
const initials = ref('')


const fetchStats = async () => {
  try {
    const response = await axios.post(
      "https://dark-caldron-448714-u5.uc.r.appspot.com/dashboard",
      {
        role: localStorage.getItem("role"),
        user_id: localStorage.getItem("user_id"),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    card1.value = data[0];
    card2.value = data[1];
    card3.value = data[2];
    card4.value = data[3];
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }
};

const fetchFlashCards = async () => {
  try {
    const response = await fetch(
      `https://dark-caldron-448714-u5.uc.r.appspot.com/flashcards/${localStorage.getItem("user_id")}`
    );

    if (!response.ok) throw new Error("Failed to fetch flashcards");

    const data = await response.json(); // Parse JSON
    recentFlashcards.value = data.flashCards; // Correct way to update ref
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }
};


onMounted(() => {
  name.value = localStorage.getItem('name') || 'Default Name'
  email.value = localStorage.getItem('email') || 'default@example.com'

  fetchStats()
  fetchFlashCards()

  const words = name.value.trim().split(' ')
  initials.value =
    words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase()
})





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

</script>

<style scoped>
.dark-bg {
  background-color: #111c44;
}
</style>
