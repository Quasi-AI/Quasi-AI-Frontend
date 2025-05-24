<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>

    <template #apps>
      <!-- User Header -->
      <!-- <UserHeader :name="userInfo.name" :email="userInfo.email" /> -->

      <!-- Stat Cards -->
      <StatCardsGrid :cards="cards" :isLoading="isLoading" />

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="flex flex-col gap-6 lg:col-span-2">
          <!-- Learning Progress Chart -->
          <LearningProgress :students="students" />

          <!-- Charts Grid -->
          <ChartsGrid
            :studentCount="studentCount"
            :educatorCount="educatorCount"
            :quizChartSeries="quizChartSeries"
          />
        </div>

        <!-- Recent Flashcards -->
        <RecentFlashcards :flashcards="recentFlashcards" />
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import UserHeader from '@/components/dashboard/UserHeader.vue'
import StatCardsGrid from '@/components/dashboard/StatCardsGrid.vue'
import LearningProgress from '@/components/dashboard/LearningProgress.vue'
import ChartsGrid from '@/components/dashboard/ChartsGrid.vue'
import RecentFlashcards from '@/components/dashboard/RecentFlashcards.vue'
import { useDashboardData } from '@/composables/useDashboardData.js'

// Import Chart.js components for registration
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

// Register Chart.js components
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

// Use the dashboard data composable
const {
  cards,
  recentFlashcards,
  students,
  studentCount,
  educatorCount,
  quizChartSeries,
  isLoading,
  userInfo,
  initializeData
} = useDashboardData()

// Initialize data on component mount
onMounted(async () => {
  await initializeData()
})
</script>

<style scoped>
.dark-bg {
  background-color: #111c44;
}
</style>
