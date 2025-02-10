<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <Sidebar />
    </template>
    <template #apps>
      <Navbar />
      <User />
    </template>
  </NuxtLayout>
</template>
