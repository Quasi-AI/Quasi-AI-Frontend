<template>
  <div>Payment ({{ selectedPrice }})</div>
</template>

<script lang="ts" setup>
const route = useRoute()
const selectedPrice = ref(route.query.price || '0.00')
</script>