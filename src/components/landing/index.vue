<template>
  <div class="relative z-10 min-h-screen xl:mx-auto 2xl:w-[1440px]">
    <!-- Hero Section -->
    <div
      class="animate-fade-in flex min-h-[60vh] flex-col items-center justify-center bg-[#E4E0F4] px-4 py-12 text-center lg:py-20"
    >
      <h1
        class="max-w-3xl text-4xl font-bold leading-tight text-[#190A53] lg:text-5xl"
      >
        <span v-html="displayedText"></span>
      </h1>
      <p
        class="animate-slide-up mt-6 max-w-xl text-lg text-gray-600"
        style="animation-delay: 0.4s"
      >
        Generate flashcards, quizzes, and study materials instantly from your
        lectures, notes, PDFs, and presentations.
      </p>
      <div
        class="animate-slide-up mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6"
        style="animation-delay: 0.6s"
      >
        <NuxtLink
          :to="isLoggedIn ? '/dashboard' : '/auth/sign-up'"
          class="rounded-lg bg-[#5D3BEA] px-8 py-3 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        >
          {{ isLoggedIn ? 'Dashboard' : 'Sign up for free' }}
        </NuxtLink>
        <NuxtLink
          to="/"
          class="rounded-lg px-8 py-3 font-normal transition duration-300 hover:text-[#5D3BEA]"
        >
          Learn more
        </NuxtLink>
      </div>

      <!-- Brand Slider -->
      <div
        class="brand-slider-wrapper animate-slide-up mt-12 w-full max-w-4xl overflow-hidden"
      >
        <div class="brand-slider animate-slide flex gap-8">
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
    <div class="relative bg-white py-20">
      <div class="container mx-auto px-4">
        <LandingUiIconsBrandsVideoplaceholder
          width="100%"
          class="animate-fade-in mx-auto h-full max-w-4xl cursor-pointer transition duration-300 hover:scale-105"
        />

        <div class="mt-20 text-center">
          <h2
            class="animate-slide-up text-3xl font-bold text-[#5D3BEA] lg:text-4xl"
          >
            Why choose Quasi AI
          </h2>
          <p
            class="animate-slide-up mt-4 text-gray-600 lg:text-wrap"
            style="animation-delay: 0.2s"
          >
            QUASI AI is one powerful platform that combines all the tools needed
            to <br />
            fully learn and retain everything you learn.
          </p>
        </div>

        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
          :to="isLoggedIn ? '/dashboard' : '/auth/sign-up'"
          class="mt-10 rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-[#4A2DCA]"
        >
          {{ isLoggedIn ? 'Go to Dashboard' : 'Sign up now' }}
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

    <!-- Pricing Section -->
    <div class="bg-white py-20 dark:bg-[#1E2A5A]">
      <div class="container mx-auto px-4">
        <h1
          class="text-center text-4xl font-bold text-slate-800 dark:text-gray-300"
        >
          Choose the plan that's right for you
        </h1>

        <!-- Pricing Toggle -->
        <div class="mt-8 flex justify-center">
          <div
            class="inline-flex rounded-full bg-gray-200 p-1 dark:bg-[#0C1438]"
          >
            <button
              @click="billingCycle = 'monthly'"
              :class="
                billingCycle === 'monthly'
                  ? 'bg-[#5D3BEA] text-white'
                  : 'text-gray-600 dark:text-gray-300'
              "
              class="rounded-full px-4 py-2 font-bold"
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
              class="rounded-full px-4 py-2 font-bold"
            >
              Yearly (5% off)
            </button>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          <!-- Basic Plan -->
          <div
            class="relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
          >
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">
              Basic Plan
            </h3>
            <p
              class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white"
            >
              $0
            </p>
            <p class="text-gray-600 dark:text-gray-300">Forever free</p>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Essential features for individuals.
            </p>
            <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Access to Quasi AI basic features
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Up to 50 AI-generated responses per month
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Email support
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Secure cloud storage
              </li>
              <li class="flex gap-2">❌ Personalized AI suggestions</li>
            </ul>
          </div>

          <!-- Premium Plan - Most Popular -->
          <div
            class="relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-xl ring-2 ring-[#5D3BEA] transition-all hover:shadow-lg dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
          >
            <div
              class="absolute right-0 top-0 -mt-4 mr-4 rounded-full bg-[#5D3BEA] px-3 py-1 text-sm font-bold text-white"
            >
              Most Popular
            </div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">
              Premium Plan
            </h3>
            <p
              class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white"
            >
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
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Access to all premium features
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Unlimited AI-generated responses
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Personalized AI suggestions
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Email support
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                AI-powered analytics & insights
              </li>
            </ul>
            <NuxtLink v-if="!isLoggedIn" to="/auth/sign-up">
              <button
                class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white hover:bg-[#4A2FCB]"
              >
                Get Started
              </button>
            </NuxtLink>
            <NuxtLink
              v-else
              :to="`/other/pricing/payment?price=${premiumPrice}`"
            >
              <button
                class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white hover:bg-[#4A2FCB]"
              >
                Upgrade
              </button>
            </NuxtLink>
          </div>

          <!-- Enterprise Plan -->
          <div
            class="relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
          >
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">
              Enterprise Plan
            </h3>
            <p
              class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white"
            >
              Custom
            </p>
            <p class="text-gray-600 dark:text-gray-300">
              Designed for educational institutions
            </p>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Scalable solutions for schools and universities.
            </p>
            <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Everything in Premium Plan
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Unlimited AI-generated responses
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Dedicated account manager
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                Custom AI models & integrations
              </li>
              <li class="flex gap-2">
                <div>
                  <LandingUiIconsPricingChecked />
                </div>
                24/7 priority educational support
              </li>
            </ul>
            <NuxtLink to="/other/support">
              <button
                class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white hover:bg-[#4A2FCB]"
              >
                Contact Sales
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { whyChooseItems, instructorSteps } from '@/constants/landing'
import LandingUiIconsFeaturesQuestions from '@/components/landing/ui/icons/features/questions.vue'
import LandingUiIconsFeaturesFlashcards from '@/components/landing/ui/icons/features/flashcards.vue'
import LandingUiIconsFeaturesTutors from '@/components/landing/ui/icons/features/tutors.vue'
import LandingUiIconsFeaturesAitutors from '@/components/landing/ui/icons/features/aitutors.vue'
import LandingUiIconsFeaturesQuizzes from '@/components/landing/ui/icons/features/quizzes.vue'
import LandingUiIconsFeaturesEssay from '@/components/landing/ui/icons/features/essay.vue'
import { useAuth } from '~/composables/useAuth'

const { isLoggedIn } = useAuth()

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
let currentText = ''
let isTag = false
let tagContent = ''
let index = 0

const typeEffect = () => {
  displayedText.value = ''
  currentText = ''
  isTag = false
  tagContent = ''
  index = 0

  const typeNextCharacter = () => {
    if (index < fullText.length) {
      const char = fullText[index]

      if (char === '<') {
        isTag = true
        tagContent = char
      } else if (char === '>') {
        isTag = false
        tagContent += char
        currentText += tagContent
        displayedText.value = currentText
      } else if (isTag) {
        tagContent += char
      } else {
        currentText += char
        displayedText.value = currentText
      }

      index++
      requestAnimationFrame(() => setTimeout(typeNextCharacter, 50))
    } else {
      setTimeout(() => {
        typeEffect()
      }, 3000)
    }
  }

  typeNextCharacter()
}

onMounted(() => {
  typeEffect()
  document.documentElement.style.scrollBehavior = 'smooth'
})

onUnmounted(() => {
  document.documentElement.style.scrollBehavior = ''
})

// Define billing cycle types
type BillingCycle = 'monthly' | 'yearly'
const billingCycle = ref<BillingCycle>('monthly')
const premiumPrice = computed<string>(() => {
  return billingCycle.value === 'monthly'
    ? '4.99'
    : (4.99 * 12 * 0.95).toFixed(2)
})

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#E4E0F4' }
  ]
})
</script>
