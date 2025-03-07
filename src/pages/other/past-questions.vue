<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <CommonNavbar />
      <AppsPastQuestions />
    </template>
  </NuxtLayout>
</template>
