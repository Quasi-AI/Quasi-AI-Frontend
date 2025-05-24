<template>
  <NuxtLayout :name="'landing-wrapper'">
    <!-- Conditional main content -->
    <LandingNavigationHeader />
    <div>
      <template v-if="!routeType">
        <Landing />
      </template>
      <Careers v-else-if="routeType === 'careers'" />
      <PrivacyPolicy v-else-if="routeType === 'privacy-policy'" />
      <TermsConditions v-else-if="routeType === 'terms-conditions'" />
    </div>

    <!-- Footer always visible -->
    <LandingNavigationFooter />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()
const routeType = computed(() => route.query.type || '')
</script>
