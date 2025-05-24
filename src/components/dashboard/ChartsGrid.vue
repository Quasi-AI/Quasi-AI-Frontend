<template>
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
</template>

<script setup>
import PieChart from '@/components/PieChart.vue'
import { Bar } from 'vue-chartjs'
import { useChartConfig } from '~/composables/useChartConfig'

const props = defineProps({
  studentCount: {
    type: Number,
    default: 0
  },
  educatorCount: {
    type: Number,
    default: 0
  },
  quizChartSeries: {
    type: Array,
    default: () => []
  }
})

const { barChartOptions } = useChartConfig()

// Computed property to update pie chart series reactively
const pieChartSeries = computed(() => [props.studentCount, props.educatorCount])

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
      data: props.quizChartSeries[0]?.data || Array(12).fill(0),
      backgroundColor: '#6366F1',
      borderRadius: 4,
      maxBarThickness: 20
    },
    {
      label: 'Quizzes Taken',
      data: props.quizChartSeries[1]?.data || Array(12).fill(0),
      backgroundColor: '#10B981',
      borderRadius: 4,
      maxBarThickness: 20
    }
  ]
}))

const quizBarOptions = computed(() => barChartOptions)
</script>
