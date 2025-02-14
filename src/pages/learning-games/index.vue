<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <Sidebar />
    </template>
    <template #apps>
      <Navbar />
      <AppsLearningGames />
    </template>
  </NuxtLayout>
</template>
