<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <CommonDashboardMockDashboard width="100%" height="100%" />

      <div class="animate-fade-in grid flex-1 grid-cols-1 gap-8 lg:grid-cols-3">
        <div
          v-for="(feature, index) in features"
          :key="index"
          @click="navigateTo(feature.route)"
          class="animate-slide-up flex cursor-pointer items-start gap-4 rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-[#111C44]"
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
import LandingUiIconsFeaturesQuestions from '@/components/landing/ui/icons/features/questions.vue'
import LandingUiIconsFeaturesQuizzes from '@/components/landing/ui/icons/features/quizzes.vue'
import LandingUiIconsFeaturesTutors from '@/components/landing/ui/icons/features/tutors.vue'

const router = useRouter()

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
