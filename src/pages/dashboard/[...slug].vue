<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <div
        class="mb-6 flex flex-col rounded-lg bg-[#fff] p-6 shadow-sm dark:bg-[#111C44] dark:text-white"
      >
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold">Learning Progress</h1>
          <div class="flex gap-4">
            <select
              v-model="selectedStudent"
              class="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-[#1E2A5A]"
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
              class="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-[#1E2A5A]"
            >
              <option value="">Select Year</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <VueApexCharts
            type="line"
            :options="chartOptions"
            :series="chartSeries"
            height="350"
          />
        </div>
      </div>

      <div class="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-3">
        <div
          v-for="(feature, index) in features"
          :key="index"
          @click="navigateTo(feature.route)"
          class="flex cursor-pointer items-start gap-4 rounded-lg p-6 hover:shadow-md dark:bg-[#111C44]"
          :class="feature.bgColor"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <!-- Icon -->
          <span
            class="flex shrink-0 items-center justify-center rounded-lg dark:backdrop-blur-sm"
          >
            <component :is="feature.icon" class="h-10 w-10" />
          </span>

          <!-- Content -->
          <div class="flex-1">
            <h3 class="mb-2 text-xl font-bold">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
      <div class="my-4 mt-10 flex items-center justify-center gap-2">
        <NuxtLink
          to="/apps"
          class="text-[#FF6636] transition duration-300 hover:underline"
        >
          See all apps
        </NuxtLink>
        <LandingUiIconsFeaturesArrowright width="14px" height="14px" />
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup>
import LandingUiIconsFeaturesQuestions from '@/components/landing/ui/icons/features/questions.vue'
import LandingUiIconsFeaturesQuizzes from '@/components/landing/ui/icons/features/quizzes.vue'
import LandingUiIconsFeaturesTutors from '@/components/landing/ui/icons/features/tutors.vue'
const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

const router = useRouter()
const selectedStudent = ref('')
const selectedYear = ref('')

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

const features = ref([
  {
    icon: LandingUiIconsFeaturesQuestions,
    title: 'Questions',
    description: 'Ask and answer questions from a large knowledge base.',
    route: '/apps/questions',
    bgColor: 'bg-[#EBEBFF] dark:bg-[#1E2A5A]',
    iconBgColor: 'bg-[#D6D6FF] dark:bg-[#2A3A6E]'
  },
  {
    icon: LandingUiIconsFeaturesQuizzes,
    title: 'Practice Quizzes',
    description:
      'Automatically generated quizzes to test understanding and track progress.',
    route: '/apps/quizzes',
    bgColor: 'bg-[#F5F7FA] dark:bg-[#232D4B]',
    iconBgColor: 'bg-[#E0E5EB] dark:bg-[#2E3A5F]'
  },
  {
    icon: LandingUiIconsFeaturesTutors,
    title: 'Tutors',
    description:
      'Create expert tutors and connect them to students for personalized learning.',
    route: '/apps/find-tutors',
    bgColor: 'bg-[#FFEEE8] dark:bg-[#3B3B5F]',
    iconBgColor: 'bg-[#FFD9CC] dark:bg-[#4A4A7A]'
  }
])

const navigateTo = route => {
  if (route) router.push(route)
}
</script>
