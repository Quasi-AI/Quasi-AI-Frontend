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
        <div class="overflow-y-auto overflow-x-hidden">
          <div class="mx-auto flex max-w-6xl flex-col items-center p-4 lg:px-0">
            <div class="flex w-full flex-col">
              <h1
                class="animate-slide-up my-4 pl-5 text-3xl font-medium dark:text-gray-400"
              >
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
const route = useRoute()

// Define route-based titles
const titles = {
  '/dashboard': 'Dashboard',
  '/apps': 'Browse top apps',
  '/apps/questions': 'Questions',
  '/apps/flashcards': 'Smart Flashcards',
  '/apps/find-tutors': 'Tutors',
  '/apps/essay': 'Essay Analyzer',
  '/apps/quizzes': 'Quizzes',
  '/apps/ai-tutor': 'AI Tutor',
  '/apps/speech-to-text': 'Speech to Text Converter',
  '/other/support': 'Customer Support',
  '/other/games': 'Games',
  '/other/past-questions': 'Past Questions',
  '/other/plan': 'Plan',
  '/user': 'Profile'
}

// Compute the page title dynamically
const pageTitle = computed(() => titles[route.path] || 'Page not recognized')
</script>
