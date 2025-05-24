<template>
  <div
    class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#111C44] dark:text-white"
  >
    <div
      class="mb-4 flex flex-col items-center justify-between gap-4 lg:flex-row"
    >
      <h1 class="text-2xl font-medium">Learning Progress</h1>
      <!-- <div class="flex gap-4">
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
      </div> -->
    </div>
    <div class="h-[350px] w-full">
      <Line :key="chartKey" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { useChartConfig } from '~/composables/useChartConfig'

const props = defineProps({
  students: {
    type: Array,
    default: () => []
  }
})

const selectedStudent = ref('')
const selectedYear = ref('')
const chartKey = ref(0)
const isChartDataLoading = ref(true)
const chartSeries = ref([])
const years = ref([])
const currentYear = new Date().getFullYear()

// Initialize years array
for (let year = 2025; year <= currentYear; year++) {
  years.value.push(year)
}

// Watch for year changes and update array if needed
watch(
  () => new Date().getFullYear(),
  newYear => {
    if (!years.value.includes(newYear)) {
      years.value.push(newYear)
    }
  }
)

const { lineChartOptions } = useChartConfig()

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

const chartOptions = computed(() => lineChartOptions)

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

// Initialize chart data
onMounted(() => {
  updateChartData()
})

// Watch for changes that should trigger chart updates
watch(
  [selectedStudent, selectedYear],
  () => {
    updateChartData()
  },
  { deep: true }
)
</script>
