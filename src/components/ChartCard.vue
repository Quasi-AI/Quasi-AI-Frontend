<template>
  <div class="chart-card">
    <h3 class="title">{{ title }}</h3>
    <VueApexCharts
      :options="chartOptions"
      :series="series"
      type="bar"
      height="300"
    />
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: { VueApexCharts },
  props: {
    title: { type: String, required: true },
    series: { type: Array, required: true },
    chartOptions: { type: Object, required: true }
  }
};
</script>

<style scoped>
.chart-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  /* 🌙 Dark mode support */
  @apply dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700;
}
.title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: bold;
}
</style>
