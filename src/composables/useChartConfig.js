export function useChartConfig() {
  // Common legend configuration
  const commonLegend = {
    position: 'top',
    align: 'end',
    labels: {
      boxWidth: 10,
      usePointStyle: true,
      pointStyle: 'circle'
    }
  }

  // Common tooltip configuration
  const commonTooltip = {
    enabled: true,
    mode: 'index',
    intersect: false,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    titleColor: '#fff',
    bodyColor: '#fff',
    padding: 10,
    displayColors: true,
    usePointStyle: true
  }

  // Common scales configuration
  const commonScales = {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#e5e7eb',
        drawBorder: false,
        drawTicks: false
      },
      ticks: {
        padding: 10,
        font: {
          size: 11
        }
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        padding: 10,
        font: {
          size: 11
        }
      },
      border: {
        display: false
      }
    }
  }

  // Line chart specific options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: commonLegend,
      tooltip: {
        ...commonTooltip,
        callbacks: {
          label: context => ` ${context.dataset.label}: ${context.parsed.y}`
        }
      }
    },
    resizeDelay: 200,
    hover: {
      mode: 'nearest',
      intersect: false,
      axis: 'x',
      animationDuration: 0
    },
    scales: {
      ...commonScales,
      y: {
        ...commonScales.y,
        ticks: {
          ...commonScales.y.ticks,
          stepSize: 5
        }
      }
    },
    transitions: {
      active: {
        animation: {
          duration: 0
        }
      }
    }
  }

  // Bar chart specific options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500
    },
    plugins: {
      legend: commonLegend,
      tooltip: commonTooltip
    },
    scales: commonScales
  }

  return {
    lineChartOptions,
    barChartOptions
  }
}
