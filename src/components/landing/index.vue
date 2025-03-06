<template>
  <div class="xl:mx-auto 2xl:w-[1440px]">
    <!-- Hero Section -->
    <div
      class="flex h-[60vh] flex-col items-center justify-center bg-[#E4E0F4] px-4 py-6 pb-0 text-center lg:py-12 lg:pb-[10rem]"
    >
      <h1 class="text-4xl font-bold leading-tight">
        Transform Your Learning <br />Experience with
        <span class="text-[#5D3BEA]">Quasi AI</span>
      </h1>
      <p class="mt-4 text-gray-600">
        Generate flashcards, quizzes, and study materials instantly from your
        <br />
        lectures, notes, PDFs, and presentations.
      </p>
      <div class="mt-10 flex space-x-4">
        <NuxtLink
          to="/auth/sign-up"
          class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:bg-[#4A2DCA]"
        >
          Start for free
        </NuxtLink>
        <NuxtLink to="/" class="rounded-lg px-6 py-2 font-normal">
          Learn more
        </NuxtLink>
      </div>
      <div class="mt-10 flex max-w-full space-x-4 overflow-x-auto">
        <LandingUiIconsBrandsAlphawave height="" width="100px" />
        <LandingUiIconsBrandsFusionx height="" width="100px" />
        <LandingUiIconsBrandsOpticore height="" width="100px" />
        <LandingUiIconsBrandsMaxiwave height="" width="100px" />
        <LandingUiIconsBrandsStellarcore height="" width="100px" />
      </div>
    </div>

    <!-- Why Choose Quasi AI Section -->
    <div class="relative flex flex-col items-center bg-white px-4 lg:px-0">
      <LandingUiIconsBrandsVideoplaceholder
        width="100%"
        class="mt-0 h-[100%] lg:absolute lg:-top-[15vh] lg:left-0 lg:right-0 lg:z-10 lg:mt-10 lg:h-[30rem]"
      />
      <div class="mt-4 lg:mt-[30rem]">
        <h2 class="text-center text-4xl font-bold text-[#5D3BEA]">
          Why choose Quasi AI
        </h2>
        <p class="mt-4 text-gray-600">
          QUASI AI is one powerful platform that combines all the tools needed
          to <br />
          fully learn and retain everything you learn.
        </p>
      </div>
      <div class="mt-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <div
          class="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6"
        >
          <LandingUiIconsServicesPeople />
          <h3 class="mt-4 text-2xl font-bold text-[#5D3BEA]">Expert Tutors</h3>
          <p class="mt-2 text-gray-600">
            Learn from industry professionals with years of experience in their
            fields. Our expert tutors provide practical insights to help you
            succeed in your learning.
          </p>
        </div>
        <div
          class="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6"
        >
          <LandingUiIconsServicesCalender />
          <h3 class="mt-4 text-2xl font-bold text-[#5D3BEA]">
            Innovative Resources
          </h3>
          <p class="mt-2 text-gray-600">
            Access a vast collection of learning materials, including
            interactive courses, real-world case studies, and hands-on projects
            designed to enhance your skills.
          </p>
        </div>
        <div
          class="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6"
        >
          <LandingUiIconsServicesDocument />
          <h3 class="mt-4 text-2xl font-bold text-[#5D3BEA]">
            Seamless Experience
          </h3>
          <p class="mt-2 text-gray-600">
            Enjoy a user-friendly platform designed for effective and engaging
            learning and retention.
          </p>
        </div>
      </div>
    </div>

    <!-- Our Top Features Section -->
    <div class="flex flex-col items-center bg-white py-20">
      <h2 class="text-4xl font-bold text-[#5D3BEA]">Our top features</h2>
      <div class="mt-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <div
          class="flex items-center gap-4 rounded-lg bg-[#EBEBFF] p-6 hover:shadow-xl"
        >
          <LandingUiIconsFeaturesQuestions />
          <div class="mt-4">
            <h3 class="text-xl font-bold">Questions</h3>
            <p class="text-gray-600">63,476 questions</p>
          </div>
        </div>
        <div
          class="flex items-center gap-4 rounded-lg bg-[#FFF2E5] p-6 hover:shadow-xl"
        >
          <LandingUiIconsFeaturesFlashcards />
          <div class="mt-4">
            <h3 class="text-xl font-bold">Smart Flashcards</h3>
            <p class="text-gray-600">About 2,736 cards</p>
          </div>
        </div>
        <div
          class="flex items-center gap-4 rounded-lg bg-[#FFEEE8] p-6 hover:shadow-xl"
        >
          <LandingUiIconsFeaturesTutors />
          <div class="mt-4">
            <h3 class="text-xl font-bold">Tutors</h3>
            <p class="text-gray-600">More than you imagine</p>
          </div>
        </div>
        <div
          class="flex items-center gap-4 rounded-lg bg-white p-6 hover:shadow-xl"
        >
          <LandingUiIconsFeaturesAitutors />
          <div class="mt-4">
            <h3 class="text-xl font-bold">AI Authors</h3>
            <p class="text-gray-600">So many of them</p>
          </div>
        </div>
        <div
          class="flex items-center gap-4 rounded-lg bg-[#F5F7FA] p-6 hover:shadow-xl"
        >
          <LandingUiIconsFeaturesQuizzes />
          <div class="mt-4">
            <h3 class="text-xl font-bold">Quizzes</h3>
            <p class="text-gray-600">About 13,932 quizzes</p>
          </div>
        </div>
        <div
          class="flex items-center gap-4 rounded-lg bg-[#FFF0F0] p-6 hover:shadow-xl"
        >
          <LandingUiIconsFeaturesEssay />
          <div class="mt-4">
            <h3 class="text-xl font-bold">Essay Analyzer</h3>
            <p class="text-gray-600">22,649 essays</p>
          </div>
        </div>
      </div>
      <p class="mt-10 flex items-center gap-2 text-gray-600">
        Sign up to see more
        <a href="/auth/sign-up" class="text-[#FF6636] hover:underline"
          >Create account for free</a
        >
        <LandingUiIconsFeaturesArrowright width="14px" height="14px" />
      </p>
    </div>

    <!-- How to Become a Successful Instructor -->
    <div class="flex flex-col items-center bg-[#F5F7FA] px-4 py-20 lg:px-0">
      <h2 class="text-center text-4xl font-bold text-[#5D3BEA]">
        How you'll become a successful instructor
      </h2>
      <div class="mt-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <div class="flex flex-col items-center rounded bg-white p-6">
          <LandingUiIconsInstructorsProfile />
          <h3 class="mt-4 text-2xl font-bold text-black">
            1. Apply to become instructor
          </h3>
          <p class="mt-2 text-gray-600">
            Just create an account for free. Be sure to indicate that you want
            to be an instructor.
          </p>
        </div>
        <div class="flex flex-col items-center rounded bg-white p-6">
          <LandingUiIconsInstructorsPlay />
          <h3 class="mt-4 text-2xl font-bold text-black">
            2. Create your new course
          </h3>
          <p class="mt-2 text-gray-600">
            Start creating your study materials and assign students to them
            right away.
          </p>
        </div>
        <div class="flex flex-col items-center rounded bg-white p-6">
          <LandingUiIconsInstructorsHandshake />
          <h3 class="mt-4 text-2xl font-bold text-black">
            3. Start teaching & earning
          </h3>
          <p class="mt-2 flex-wrap text-gray-600">
            Right on! Yes, it’s that easy. You’re all set. Congratulations!
          </p>
        </div>
      </div>
    </div>

    <!-- Start Teaching with Us -->
    <div
      class="flex flex-col items-center justify-center gap-10 bg-[#1E293B] px-4 py-20 lg:flex-row lg:gap-12"
    >
      <div class="flex flex-col items-center lg:items-start lg:text-left">
        <h2 class="text-center text-3xl font-bold text-white lg:text-left">
          Start teaching with us and inspire others
        </h2>
        <p class="mt-4 text-white">
          Become an instructor & start teaching with other certified <br />
          instructors. Create a success story with our dedicated <br />
          learners — Grow yourself with from different countries.
        </p>
        <a
          href="/auth/sign-up"
          class="mt-8 rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:bg-[#4A2DCA]"
          >Sign up now</a
        >
      </div>
      <div class="mt-10 lg:mt-0">
        <LandingUiIconsTeachwithusAdimage width="100%" height="" />
      </div>
    </div>

    <!-- Learn from Experts -->
    <div class="flex flex-col items-center gap-10 bg-white px-4 py-20">
      <div
        class="flex flex-col items-center justify-between gap-16 lg:flex-row"
      >
        <div>
          <LandingUiIconsMoreinfoFirstUser width="100%" height="" />
        </div>
        <div class="lg:text-left">
          <h2
            class="text-center text-4xl font-bold text-[#5D3BEA] lg:text-left"
          >
            <span class="text-[#F48C06]">Tools</span> For Teachers <br />
            And Learners
          </h2>
          <p class="mt-4 text-gray-600">
            QUASI AI has a dynamic set of teaching tools built <br />
            just for you, whether you are a student or teacher. <br />
            Teachers can handout assignments in real-time for <br />
            students to complete and submit.
          </p>
        </div>
      </div>
      <div
        class="mt-20 flex flex-col items-center justify-between gap-16 border-t border-gray-200 py-16 lg:flex-row lg:border-none"
      >
        <div class="lg:text-left">
          <h2
            class="text-center text-4xl font-bold text-[#5D3BEA] lg:text-left"
          >
            Learn from 20+ Expert <br />
            Instructors
          </h2>
          <p class="mt-4 text-gray-600">
            Gain knowledge from a diverse team of experienced <br />
            professionals across various fields. Our instructors bring <br />
            real-world expertise, ensuring you get the best guidance <br />
            and insights to excel in your learning journey.
          </p>
          <LandingUiIconsMoreinfoTestimonial
            width="100%"
            height=""
            class="mt-6"
          />
          <div class="mt-2 flex items-center gap-4">
            <LandingUiIconsMoreinfoPaginations width="60px" height="" />
          </div>
        </div>
        <div>
          <LandingUiIconsMoreinfoSecondUser width="100%" height="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>
