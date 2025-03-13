<template>
  <div class="chart-card">
    <h3 class="title">{{ title }}</h3>
    <VueApexCharts
      :options="chartOptions"
      :series="series"
      type="donut"
      height="300"
    />
    <!-- Custom legend -->
    <div class="legend">
      <div class="legend-item">
        <span class="dot" style="background-color: #ef4444"></span>
        <strong>{{ series[0] }}</strong>
        <span class="percentage">({{ percentages[0] }}%)</span>
      </div>
      <div class="legend-item">
        <span class="dot" style="background-color: #6366f1"></span>
        <strong>{{ series[1] }}</strong>
        <span class="percentage">({{ percentages[1] }}%)</span>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  components: { VueApexCharts },
  props: {
    title: { type: String, required: true },
    series: { type: Array, required: true, default: () => [0, 0] },
    chartOptions: { type: Object, required: true, default: () => ({}) }
  },
  computed: {
    total() {
      return this.series.reduce((sum, value) => sum + value, 0)
    },
    percentages() {
      return this.series.map(value => ((value / this.total) * 100).toFixed(0))
    }
  }
}
</script>

<style scoped>
.chart-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;

  /* 🌙 Dark mode support */
  @apply dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-white;
}

.title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: bold;
}

.legend {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 16px;
  font-size: 14px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.percentage {
  opacity: 0.7;
  margin-left: 4px;
}
</style>
