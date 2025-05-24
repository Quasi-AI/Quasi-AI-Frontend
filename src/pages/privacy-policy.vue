<template>
  <NuxtLayout :name="'landing-wrapper'">
    <div class="container mx-auto px-4 py-16">
      <div class="mb-8 flex items-center">
        <button
          @click="goBack"
          class="flex items-center text-gray-600 transition-colors hover:text-[#5D3BEA] dark:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      <h1 class="mb-10 text-center text-4xl font-bold text-[#5D3BEA]">
        Privacy Policy
      </h1>

      <div class="prose dark:prose-invert mx-auto mb-16 max-w-3xl">
        <p class="mb-8 text-sm text-gray-500">Last Updated: May 24, 2025</p>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">
            Introduction
          </h2>
          <p>
            At Quasi AI, we respect your privacy and are committed to protecting
            your personal data. This Privacy Policy explains how we collect,
            use, and safeguard your information when you use our educational
            platform and services.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">
            Information We Collect
          </h2>
          <p>We collect several types of information, including:</p>
          <ul class="list-disc space-y-2 pl-6">
            <li>
              <strong>Personal Information:</strong> Name, email address, and
              profile image when you create an account
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you interact
              with our platform, including flashcards, quizzes, and questions
              you create
            </li>
            <li>
              <strong>Learning Content:</strong> Educational materials you
              upload or create using our services
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, device
              information, and cookies
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">
            How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul class="list-disc space-y-2 pl-6">
            <li>Provide and maintain our educational services</li>
            <li>Personalize your learning experience</li>
            <li>Improve our platform and develop new features</li>
            <li>Communicate with you about updates and new features</li>
            <li>Ensure the security of our platform</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">
            Data Security
          </h2>
          <p>
            We implement appropriate security measures to protect your personal
            information from unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the Internet or
            electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">
            Your Rights
          </h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul class="list-disc space-y-2 pl-6">
            <li>Access, update, or delete your personal information</li>
            <li>Object to our processing of your data</li>
            <li>Request restrictions on processing your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">
            Changes to This Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold text-[#5D3BEA]">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
            <a href="mailto:privacy@quasiai.com" class="text-[#5D3BEA]"
              >privacy@quasiai.com</a
            >
          </p>
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>
