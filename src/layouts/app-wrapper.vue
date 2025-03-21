<template>
  <ClientOnly>
    <CommonNavbar />
    <div class="flex w-full bg-[#F4F7FE] dark:bg-[#0C1438]">
      <div
        class="hidden min-h-screen w-64 bg-gray-200 transition-all duration-300 lg:block dark:bg-gray-900"
      >
        <slot name="sidebar"></slot>
      </div>

      <div class="flex-1">
        <div class="mx-0 mt-20 overflow-y-auto overflow-x-hidden lg:mx-4">
          <div class="mx-auto flex max-w-6xl flex-col items-center p-4 lg:px-0">
            <div class="flex w-full flex-col">
              <h1 class="my-4 flex items-center gap-3 text-3xl font-medium">
                <template v-if="showBackIcon">
                  <button @click="router.back()" class="focus:outline-none">
                    <BackIcon />
                  </button>
                </template>
                {{ pageTitle }}
              </h1>

              <slot name="apps"></slot>
              <CommonNavbarBottom />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import BackIcon from '../assets/icons/back-icon.vue'

const route = useRoute()
const router = useRouter()
const pageTitle = computed(() => titles[route.path] || 'Page not recognized')
const hideBackIconRoutes = ['/dashboard', '/apps']
const showBackIcon = computed(() => !hideBackIconRoutes.includes(route.path))

// Greeting
const greeting = computed(() => {
  const hours = new Date().getHours()
  if (hours < 12) return 'Good Morning 🌞'
  if (hours < 18) return 'Good Afternoon 🌤️'
  return 'Good evening 🌙 '
})

// Define route-based titles
const titles = {
  '/dashboard': greeting,
  '/apps': 'Browse top apps',
  '/apps/questions': 'Questions',
  '/apps/flashcards': 'Smart Flashcards',
  '/apps/find-tutors': 'Tutors',
  '/apps/essay': 'Essay Analyzer',
  '/apps/quizzes': 'Quizzes',
  '/apps/ai-tutor': 'AI Tutor',
  '/apps/speech-to-text': 'Speech to Text',
  '/other/support': 'Customer Support',
  '/other/games': 'Learning Games',
  '/other/past-questions': 'Past Questions',
  '/other/pricing/plan': 'Plan',
  '/other/pricing/payment': 'Payment Details',
  '/user': 'Profile'
}
</script>
