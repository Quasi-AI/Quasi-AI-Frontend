<template>
  <NuxtLayout :name="'default'">
    <div class="container mx-auto px-4 py-16">
      <h1 class="mb-10 text-center text-4xl font-bold text-[#5D3BEA]">
        Careers at Quasi AI
      </h1>

      <div class="mx-auto mb-16 max-w-3xl">
        <p class="mb-6 text-lg">
          Join our team of passionate innovators who are revolutionizing
          education through AI. At Quasi AI, we're dedicated to creating tools
          that help students learn more effectively and help educators teach
          more efficiently.
        </p>

        <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">
          Why Work With Us
        </h2>
        <ul class="mb-8 list-disc space-y-2 pl-6">
          <li>Work on meaningful technology that impacts learning worldwide</li>
          <li>Collaborative and innovative work environment</li>
          <li>Flexible work arrangements and competitive benefits</li>
          <li>Opportunities for continuous learning and professional growth</li>
          <li>Be part of a diverse and inclusive team</li>
        </ul>

        <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">
          Open Positions
        </h2>
        <div class="space-y-6">
          <div
            class="rounded-lg border bg-white p-6 shadow-sm dark:bg-[#111C44]"
          >
            <h3 class="mb-2 text-xl font-semibold">AI Research Scientist</h3>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Full-time • Remote • Research Team
            </p>
            <p class="mb-4">
              We're looking for AI researchers with expertise in natural
              language processing to help advance our educational AI models.
            </p>
            <button
              class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:bg-[#4A2DCA]"
            >
              Apply Now
            </button>
          </div>

          <div
            class="rounded-lg border bg-white p-6 shadow-sm dark:bg-[#111C44]"
          >
            <h3 class="mb-2 text-xl font-semibold">Frontend Developer</h3>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Full-time • Remote • Engineering Team
            </p>
            <p class="mb-4">
              We're seeking experienced Vue.js developers to help build and
              improve our educational platform.
            </p>
            <button
              class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:bg-[#4A2DCA]"
            >
              Apply Now
            </button>
          </div>

          <div
            class="rounded-lg border bg-white p-6 shadow-sm dark:bg-[#111C44]"
          >
            <h3 class="mb-2 text-xl font-semibold">
              Education Content Specialist
            </h3>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Full-time • Remote • Content Team
            </p>
            <p class="mb-4">
              Join us to develop high-quality educational content and ensure our
              AI provides accurate and helpful learning materials.
            </p>
            <button
              class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:bg-[#4A2DCA]"
            >
              Apply Now
            </button>
          </div>
        </div>

        <div class="mt-12 text-center">
          <p class="mb-4">Don't see a position that matches your skills?</p>
          <button
            class="rounded-lg bg-[#5D3BEA] px-6 py-2 text-white transition hover:bg-[#4A2DCA]"
          >
            Submit General Application
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>
