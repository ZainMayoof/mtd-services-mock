<template>
  <div class="recon-chart">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

const props = defineProps<{
  mean: number
  sigma: number
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const buildData = (mean: number, sigma: number) => {
  const bins = 24
  const minX = mean - 4 * sigma
  const maxX = mean + 4 * sigma
  const step = (maxX - minX) / bins
  const labels: number[] = []
  const histogram: number[] = []

  for (let i = 0; i < bins; i++) {
    const center = minX + (i + 0.5) * step
    labels.push(Math.round(center))
    const exponent = -0.5 * Math.pow((center - mean) / sigma, 2)
    const base = Math.exp(exponent)
    histogram.push(Math.round(base * 400 + Math.random() * 25))
  }

  const gaussian = labels.map(label => {
    const exponent = -0.5 * Math.pow((label - mean) / sigma, 2)
    return Math.exp(exponent) * 400
  })

  return { labels, histogram, gaussian }
}

const renderChart = () => {
  if (!canvasRef.value) return
  const { labels, histogram, gaussian } = buildData(props.mean, props.sigma)

  chart = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Frequency',
          data: histogram,
          borderRadius: 2,
          backgroundColor: 'rgba(15, 146, 191, 0.35)',
          borderColor: '#0f92bf'
        },
        {
          type: 'line',
          label: 'Gaussian fit',
          data: gaussian,
          borderColor: '#ef4444',
          borderWidth: 1.5,
          pointRadius: 0,
          borderDash: [5, 4],
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Time Resolution [ps]' }
        },
        y: {
          title: { display: true, text: 'Count' },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  })
}

const destroyChart = () => {
  if (chart) {
    chart.destroy()
    chart = null
  }
}

onMounted(() => {
  renderChart()
})

onBeforeUnmount(() => {
  destroyChart()
})

watch(
  () => [props.mean, props.sigma],
  () => {
    destroyChart()
    renderChart()
  }
)
</script>

<style scoped>
.recon-chart {
  width: 100%;
  height: 260px;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
