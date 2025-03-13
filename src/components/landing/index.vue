<template>
  <div class="z-10 xl:mx-auto 2xl:w-[1440px]">
    <!-- Hero Section -->
    <div
      class="animate-fade-in flex h-[60vh] flex-col items-center justify-center bg-[#E4E0F4] pb-0 text-center lg:text-wrap lg:py-5"
    >
      <h1
        class="h-[120px] w-[100%] px-4 text-3xl font-bold leading-tight text-[#190A53] lg:h-[80px] lg:w-[35%]"
      >
        <span v-html="displayedText"></span>
      </h1>
      <p
        class="animate-slide-up mt-4 w-[100%] text-wrap px-4 text-sm text-gray-600 lg:w-[33%] lg:text-wrap"
        style="animation-delay: 0.4s"
      >
        Generate flashcards, quizzes, and study materials instantly from your
        lectures, notes, PDFs, and presentations.
      </p>
      <div
        class="animate-slide-up mt-5 flex space-x-4"
        style="animation-delay: 0.6s"
      >
        <NuxtLink
          :to="userInfo ? '/dashboard' : '/auth/login'"
          class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        >
          {{ userInfo ? 'Dashboard' : 'Login' }}
        </NuxtLink>
        <NuxtLink
          to="/"
          class="rounded-lg px-6 py-2 font-normal transition duration-300 hover:text-[#5D3BEA]"
        >
          Learn more
        </NuxtLink>
      </div>
      <div
        class="brand-slider-wrapper animate-slide-up mt-10 flex w-full items-center gap-8 pb-0 lg:w-[50%] lg:pb-10"
      >
        <div class="brand-slider">
          <LandingUiIconsBrandsAlphawave class="brand-icon" />
          <LandingUiIconsBrandsFusionx class="brand-icon" />
          <LandingUiIconsBrandsOpticore class="brand-icon" />
          <LandingUiIconsBrandsMaxiwave class="brand-icon" />
          <LandingUiIconsBrandsStellarcore class="brand-icon" />

          <!-- Duplicate -->
          <LandingUiIconsBrandsAlphawave class="brand-icon" />
          <LandingUiIconsBrandsFusionx class="brand-icon" />
          <LandingUiIconsBrandsOpticore class="brand-icon" />
          <LandingUiIconsBrandsMaxiwave class="brand-icon" />
          <LandingUiIconsBrandsStellarcore class="brand-icon" />

          <!-- Duplicate -->
          <LandingUiIconsBrandsAlphawave class="brand-icon" />
          <LandingUiIconsBrandsFusionx class="brand-icon" />
          <LandingUiIconsBrandsOpticore class="brand-icon" />
          <LandingUiIconsBrandsMaxiwave class="brand-icon" />
          <LandingUiIconsBrandsStellarcore class="brand-icon" />

          <!-- Duplicate -->
          <LandingUiIconsBrandsAlphawave class="brand-icon" />
          <LandingUiIconsBrandsFusionx class="brand-icon" />
          <LandingUiIconsBrandsOpticore class="brand-icon" />
          <LandingUiIconsBrandsMaxiwave class="brand-icon" />
          <LandingUiIconsBrandsStellarcore class="brand-icon" />
        </div>
      </div>
    </div>

    <!-- Why Choose Quasi AI Section -->
    <div
      class="relative flex flex-col items-center rounded-t-3xl bg-white lg:rounded-none lg:px-0"
    >
      <LandingUiIconsBrandsVideoplaceholder
        width="100%"
        class="animate-fade-in h-full cursor-pointer lg:absolute lg:top-[-50px] lg:h-[230px]"
      />
      <div class="mt-12 bg-white px-4 lg:mt-[200px] lg:px-0">
        <h2
          class="animate-slide-up text-center text-3xl font-bold text-[#5D3BEA] lg:text-4xl"
        >
          Why choose Quasi AI
        </h2>
        <p
          class="animate-slide-up mt-4 text-center text-gray-600 lg:text-wrap"
          style="animation-delay: 0.2s"
        >
          QUASI AI is one powerful platform that combines all the tools needed
          to <br />
          fully learn and retain everything you learn.
        </p>
      </div>

      <div
        class="mt-10 grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-3 lg:px-0"
      >
        <div
          v-for="(item, index) in whyChooseItems"
          :key="index"
          class="animate-slide-up flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center lg:text-wrap"
          :style="{ 'animation-delay': `${index * 0.2}s` }"
        >
          <component :is="item.icon" />
          <h3 class="mt-4 text-2xl font-bold text-[#5D3BEA]">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-gray-600">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- Our Top Features Section -->
    <div class="flex flex-col items-center bg-white px-4 py-20 lg:px-0">
      <h2 class="animate-slide-up text-4xl font-bold text-[#5D3BEA]">
        Our top features
      </h2>
      <div class="mt-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <div
          v-for="(feature, features) in features"
          :key="features.title"
          class="flex items-center gap-4 rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-md"
          :class="feature.bgColor"
          :style="{ 'animation-delay': `${features.title * 0.2}s` }"
          v-animate-onscroll="'slide-up'"
        >
          <component :is="feature.icon" />
          <div class="mt-4">
            <h3 class="text-xl font-bold">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
      <div
        class="animate-slide-up mt-10 flex flex-col items-center gap-3 text-gray-600 lg:flex-row"
        style="animation-delay: 0.2s"
      >
        Sign up to see more
        <div class="flex items-center gap-2">
          <a
            href="/auth/sign-up"
            class="text-[#FF6636] transition duration-300 hover:underline"
            >Create account for free</a
          >
          <LandingUiIconsFeaturesArrowright width="14px" height="14px" />
        </div>
      </div>
    </div>

    <!-- How to Become a Successful Instructor -->
    <div class="flex flex-col items-center bg-[#F5F7FA] px-4 py-20 lg:px-0">
      <h2
        class="animate-slide-up text-center text-3xl font-bold text-[#5D3BEA] lg:text-4xl"
      >
        How you'll become a <br />successful instructor
      </h2>
      <div class="mt-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <div
          v-for="(step, index) in instructorSteps"
          :key="index"
          class="animate-slide-up flex flex-col items-center rounded bg-white p-6 text-center lg:text-wrap"
          :style="{ 'animation-delay': `${index * 0.2}s` }"
        >
          <component :is="step.icon" />
          <h3 class="mt-4 text-xl font-bold text-black">{{ step.title }}</h3>
          <p class="text-md mt-2 text-center text-gray-600">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Start Teaching with Us -->
    <div
      class="animate-fade-in flex flex-col items-center justify-center gap-10 bg-[#1E293B] px-4 py-20 lg:flex-row lg:gap-12"
    >
      <div
        class="flex w-[100%] flex-col items-center text-center lg:w-[50%] lg:items-start lg:text-wrap lg:text-left"
      >
        <h2 class="animate-slide-up text-3xl font-bold text-white lg:text-left">
          Start teaching with us and inspire others
        </h2>
        <p
          class="animate-slide-up mt-4 text-white"
          style="animation-delay: 0.2s"
        >
          Become an instructor & start teaching with other certified
          instructors. Create a success story with our dedicated learners — Grow
          yourself with from different countries.
        </p>
        <NuxtLink
          :to="userInfo ? '/dashboard' : '/auth/sign-up'"
          class="mt-10 rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        >
          {{ userInfo ? 'Dashboard' : 'Sign up now' }}
        </NuxtLink>
      </div>
      <div class="animate-slide-up mt-10 lg:mt-0" style="animation-delay: 0.6s">
        <LandingUiIconsTeachwithusAdimage
          width="100%"
          height=""
          class="transition duration-300 hover:scale-105"
        />
      </div>
    </div>

    <!-- Learn from Experts -->
    <div class="flex flex-col items-center gap-2 bg-white px-4 py-20 lg:gap-10">
      <div
        class="animate-fade-in flex flex-col items-center justify-between gap-16 lg:flex-row"
      >
        <div class="animate-slide-up">
          <LandingUiIconsMoreinfoFirstUser
            width="100%"
            class="h-[100%] transition duration-300 hover:scale-105 lg:h-[30rem]"
          />
        </div>
        <div class="w-[100%] lg:w-[50%] lg:text-left">
          <h2
            class="animate-slide-up text-center text-4xl font-bold text-[#5D3BEA] lg:text-wrap lg:text-left"
          >
            <span class="text-[#F48C06]">Tools</span> For Teachers <br />
            And Learners
          </h2>
          <p
            class="animate-slide-up mt-4 text-center text-gray-600 lg:text-wrap"
            style="animation-delay: 0.2s"
          >
            QUASI AI has a dynamic set of teaching tools built just for you,
            whether you are a student or teacher. Teachers can handout
            assignments in real-time for students to complete and submit.
          </p>
        </div>
      </div>
      <div
        class="animate-fade-in mt-20 flex flex-col items-center justify-between gap-16 border-t border-gray-200 py-16 text-center lg:flex-row lg:text-wrap lg:border-none"
      >
        <div class="w-[100%] lg:w-[50%] lg:text-left">
          <h2
            class="animate-slide-up text-center text-3xl font-bold text-[#5D3BEA] lg:text-left lg:text-4xl"
          >
            Learn from 20+ Expert <br />Instructors
          </h2>
          <p
            class="animate-slide-up mt-4 text-gray-600"
            style="animation-delay: 0.2s"
          >
            Gain knowledge from a diverse team of experienced professionals
            across various fields. Our instructors bring real-world expertise,
            ensuring you get the best guidance and insights to excel in your
            learning journey.
          </p>
          <LandingUiIconsMoreinfoTestimonial
            width="100%"
            height=""
            class="animate-slide-up mt-6"
            style="animation-delay: 0.4s"
          />
        </div>
        <div class="animate-slide-up" style="animation-delay: 0.2s">
          <LandingUiIconsMoreinfoSecondUser
            width="100%"
            class="h-[100%] transition duration-300 hover:scale-105 lg:h-[30rem]"
          />
        </div>
      </div>
    </div>

    <!-- Pricing -->
    <div
      class="mb-4 flex flex-col items-center justify-center gap-4 rounded-lg border-t border-gray-200 bg-white p-6 pt-24 lg:mb-12 lg:border-none lg:pt-0 dark:bg-[#1E2A5A]"
    >
      <h1
        class="text-center text-3xl font-bold text-slate-800 dark:text-gray-300"
      >
        Choose the plan that's right for you
      </h1>

      <!-- Tabs -->
      <div class="flex gap-2 rounded-lg bg-gray-200 p-1 dark:bg-[#0C1438]">
        <button
          @click="billingCycle = 'monthly'"
          :class="
            billingCycle === 'monthly'
              ? 'bg-[#5D3BEA] text-white'
              : 'text-gray-600 dark:text-gray-300'
          "
          class="rounded-md px-4 py-2 font-bold"
        >
          Monthly
        </button>
        <button
          @click="billingCycle = 'yearly'"
          :class="
            billingCycle === 'yearly'
              ? 'bg-[#5D3BEA] text-white'
              : 'text-gray-600 dark:text-gray-300'
          "
          class="rounded-md px-4 py-2 font-bold"
        >
          Yearly (5% off)
        </button>
      </div>

      <div class="grid w-full gap-3 sm:grid-cols-1 md:grid-cols-2 lg:max-w-4xl">
        <!-- Free Plan -->
        <div
          class="w-fit rounded-2xl border bg-white p-6 hover:shadow-xl dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
        >
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Free plan
          </h3>
          <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
            $0
          </p>
          <p class="text-gray-600 dark:text-gray-300">Forever free</p>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Essential features for individuals.
          </p>
          <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> Access to Quasi AI basic features
            </li>
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> Up to 20 AI-generated responses
              per month
            </li>
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> Email support
            </li>
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> Secure cloud storage for
              AI-generated content
            </li>
            <li>❌ Personalized AI suggestions</li>
            <li>❌ API access for seamless integration</li>
          </ul>
          <NuxtLink :to="userInfo ? '/other/plan' : '/auth/sign-up'">
            <button
              class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white"
            >
              Get started
            </button>
          </NuxtLink>
        </div>

        <!-- Premium Plan -->
        <div
          class="relative w-fit rounded-2xl border bg-white p-6 hover:shadow-xl dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
        >
          <LandingUiIconsPricingWords
            class="absolute -right-24 -top-4 hidden lg:block"
          />
          <LandingUiIconsPricingArrow
            class="absolute -right-5 -top-4 hidden lg:block"
          />
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">
              Premium plan
            </h3>
            <span
              class="block rounded-full bg-[#5D3BEA] px-3 py-1 text-sm font-bold text-white lg:hidden"
              >Most Popular</span
            >
          </div>
          <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
            ${{ premiumPrice }}
          </p>
          <p class="text-gray-600 dark:text-gray-300">
            {{
              billingCycle === 'monthly'
                ? 'per user per month'
                : 'billed annually'
            }}
          </p>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Advanced features for power users.
          </p>
          <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> Everything in Free Plan
            </li>
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> Up to 500 AI-generated responses
              per month
            </li>
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> Personalized AI suggestions
            </li>
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> Priority email & chat support
            </li>
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> AI-powered analytics & insights
            </li>
            <li class="flex gap-2">
              <LandingUiIconsPricingChecked /> API access for seamless
              integration
            </li>
          </ul>
          <NuxtLink :to="userInfo ? '/other/plan' : '/auth/sign-up'">
            <button
              class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white"
            >
              Get started
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { whyChooseItems, instructorSteps } from '@/constants/landing'
import LandingUiIconsFeaturesQuestions from '@/components/landing/ui/icons/features/questions.vue'
import LandingUiIconsFeaturesFlashcards from '@/components/landing/ui/icons/features/flashcards.vue'
import LandingUiIconsFeaturesTutors from '@/components/landing/ui/icons/features/tutors.vue'
import LandingUiIconsFeaturesAitutors from '@/components/landing/ui/icons/features/aitutors.vue'
import LandingUiIconsFeaturesQuizzes from '@/components/landing/ui/icons/features/quizzes.vue'
import LandingUiIconsFeaturesEssay from '@/components/landing/ui/icons/features/essay.vue'
import { useUser } from '~/composables/useUser'

const { userInfo } = useUser()
const billingCycle = ref('monthly')

const premiumPrice = computed(() => {
  return billingCycle.value === 'monthly' ? 5 : (5 * 12 * 0.95).toFixed(2)
})

const features = ref([
  {
    icon: LandingUiIconsFeaturesQuestions,
    title: 'Questions',
    description: '63,476 questions',
    bgColor: 'bg-[#EBEBFF]'
  },
  {
    icon: LandingUiIconsFeaturesFlashcards,
    title: 'Smart Flashcards',
    description: 'About 2,736 cards',
    bgColor: 'bg-[#FFF2E5]'
  },
  {
    icon: LandingUiIconsFeaturesTutors,
    title: 'Tutors',
    description: 'More than you imagine',
    bgColor: 'bg-[#FFEEE8]'
  },
  {
    icon: LandingUiIconsFeaturesAitutors,
    title: 'AI Authors',
    description: 'So many of them',
    bgColor: 'bg-[#FFFFFF]'
  },
  {
    icon: LandingUiIconsFeaturesQuizzes,
    title: 'Quizzes',
    description: 'About 13,932 quizzes',
    bgColor: 'bg-[#F5F7FA]'
  },
  {
    icon: LandingUiIconsFeaturesEssay,
    title: 'Essay Analyzer',
    description: '22,649 essays',
    bgColor: 'bg-[#FFF0F0]'
  }
])

// Text Animation
const fullText =
  'Transform Your Learning Experience with <span style="color:#5D3BEA">Quasi AI</span>'
const displayedText = ref('')
let index = 0

const typeEffect = () => {
  displayedText.value = ''
  index = 0

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = fullText
  const characters = tempDiv.innerHTML.split('')

  const interval = setInterval(() => {
    if (index < characters.length) {
      displayedText.value += characters[index]
      index++
    } else {
      clearInterval(interval)
      setTimeout(typeEffect, 1500)
    }
  }, 50)
}

onMounted(typeEffect)

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#E4E0F4' }
  ]
})
</script>
