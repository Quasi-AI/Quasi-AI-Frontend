<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <div
        class="mb-6 flex flex-col dark:text-white rounded-lg bg-[#fff] p-2 dark:bg-[#111C44]"
      >
        <div>
          <h1 class="text-2xl font-bold">Learning Progress</h1>
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
            <h3 class="text-xl font-bold">{{ feature.title }}</h3>
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
import { defineAsyncComponent } from 'vue'
import LandingUiIconsFeaturesQuestions from '@/components/landing/ui/icons/features/questions.vue'
import LandingUiIconsFeaturesQuizzes from '@/components/landing/ui/icons/features/quizzes.vue'
import LandingUiIconsFeaturesTutors from '@/components/landing/ui/icons/features/tutors.vue'
const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

const router = useRouter()
const chartOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false } },
  stroke: { curve: 'smooth' },
  tooltip: { enabled: true }
}))

const chartSeries = [
  {
    name: 'Quizzes taken',
    data: [
      1000, 1500, 5000, 1000, 4000, 4031, 3200, 2700, 3800, 2500, 4200, 3900,
      4500, 4700, 4300
    ]
  },
  {
    name: 'Flashcards created',
    data: [
      900, 1400, 1800, 1500, 2300, 2335, 2100, 1900, 2600, 2200, 3100, 2900,
      3300, 3500, 3100
    ]
  }
]

const features = ref([
  {
    icon: LandingUiIconsFeaturesQuestions,
    title: 'Questions',
    description: 'Ask and answer questions from a large knowledge base.',
    route: '/apps/questions',
    bgColor: 'bg-[#EBEBFF] dark:bg-[#1E2A5A]'
  },
  {
    icon: LandingUiIconsFeaturesQuizzes,
    title: 'Practice Quizzes',
    description:
      'Automatically generated quizzes to test understanding and track progress.',
    route: '/apps/quizzes',
    bgColor: 'bg-[#F5F7FA] dark:bg-[#232D4B]'
  },
  {
    icon: LandingUiIconsFeaturesTutors,
    title: 'Tutors',
    description:
      'Create expert tutors and connect them to students for personalized learning.',
    route: '/apps/find-tutors',
    bgColor: 'bg-[#FFEEE8] dark:bg-[#3B3B5F]'
  }
])

const navigateTo = route => {
  if (route) router.push(route)
}
</script>
