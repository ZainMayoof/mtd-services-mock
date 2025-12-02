<template>
  <div class="chart-container">
    <div class="chart-legend">
      <span>Frequency</span>
      <span>mean={{ props.mean.toFixed(1) }} ps, std={{ props.std.toFixed(1) }} ps</span>
    </div>
    <canvas :ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  channelId: {
    type: Number,
    required: true
  },
  mean: {
    type: Number,
    required: true
  },
  std: {
    type: Number,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

// Generate histogram data
const generateHistogramData = () => {
  const bins = 20
  const minX = props.mean - 4 * props.std
  const maxX = props.mean + 4 * props.std
  const binWidth = (maxX - minX) / bins
  const histogram = new Array(bins).fill(0)
  
  // Generate random data points following Gaussian distribution
  const numPoints = 1000
  for (let i = 0; i < numPoints; i++) {
    // Box-Muller transform for Gaussian distribution
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const value = props.mean + z0 * props.std
    
    if (value >= minX && value <= maxX) {
      const binIndex = Math.floor((value - minX) / binWidth)
      if (binIndex >= 0 && binIndex < bins) {
        histogram[binIndex]++
      }
    }
  }
  
  return { histogram, minX, maxX, binWidth }
}

// Generate Gaussian curve data
const generateGaussianData = (minX, maxX) => {
  const points = 100
  const step = (maxX - minX) / points
  const data = []
  
  for (let i = 0; i <= points; i++) {
    const x = minX + i * step
    const exponent = -0.5 * Math.pow((x - props.mean) / props.std, 2)
    const y = Math.exp(exponent) * 100 // Scale for visibility
    data.push({ x, y })
  }
  
  return data
}

const createChart = () => {
  if (!chartRef.value) return
  
  const { histogram, minX, maxX, binWidth } = generateHistogramData()
  const gaussianData = generateGaussianData(minX, maxX)
  
  // Create bin labels (center of each bin)
  const labels = []
  for (let i = 0; i < histogram.length; i++) {
    labels.push(Math.round(minX + (i + 0.5) * binWidth))
  }
  
  // Scale Gaussian to match histogram max
  const maxHist = Math.max(...histogram)
  const maxGauss = Math.max(...gaussianData.map(d => d.y))
  const scaleFactor = maxHist / maxGauss
  const scaledGaussian = gaussianData.map(d => d.y * scaleFactor)
  
  // Create x values for Gaussian (matching bin centers)
  const gaussianXValues = []
  for (let i = 0; i < histogram.length; i++) {
    const x = minX + (i + 0.5) * binWidth
    gaussianXValues.push(x)
  }
  
  // Interpolate Gaussian values at bin centers
  const gaussianAtBins = gaussianXValues.map(x => {
    // Find closest point in gaussianData
    let closest = gaussianData[0]
    let minDist = Math.abs(x - gaussianData[0].x)
    for (const point of gaussianData) {
      const dist = Math.abs(x - point.x)
      if (dist < minDist) {
        minDist = dist
        closest = point
      }
    }
    return closest.y * scaleFactor
  })
  
  // Destroy existing chart if any
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Frequency',
          data: histogram,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          order: 2
        },
        {
          label: 'Gaussian Fit',
          data: gaussianAtBins,
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          order: 1,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time Resolution [ps]'
          },
          ticks: {
            maxTicksLimit: 10
          }
        },
        y: {
          title: {
            display: true,
            text: 'Count'
          },
          beginAtZero: true
        }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})

watch([() => props.mean, () => props.std], () => {
  createChart()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  position: relative;
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 12px;
  color: #4A4A4A;
  margin-bottom: 8px;
}

.chart-legend span:first-child {
  font-weight: 600;
}

.chart-legend span:last-child {
  color: #7A7A7A;
}
</style>

