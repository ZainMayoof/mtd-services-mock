<template>
  <div class="collector-page">
    <!-- Filter Card -->
    <div v-if="showFilter" ref="filterCardRef" class="collector-card">
      <div class="card-header">
        <div class="header-title">
          <span>MTD BTL Collector</span>
          <span class="info-icon">i</span>
        </div>
      </div>

      <div class="card-body">
        <div class="form-group">
          <label class="field-label">Serenity board</label>
          <div class="dropdown-wrapper">
            <select v-model="serenity" class="dropdown" @change="onSerenityChange">
              <option value="" disabled selected>Select</option>
              <option value="S1.2">S1.2</option>
              <option value="Z1.1" disabled>Z1.1</option>
              <option value="Z1.2" disabled>Z1.2</option>
            </select>
            <span class="dropdown-arrow">v</span>
          </div>
        </div>

        <div class="form-group">
          <label class="field-label">CC</label>
          <div class="dropdown-wrapper">
            <select v-model="cc" class="dropdown" :disabled="ccDisabled">
              <option value="" disabled selected>Select</option>
              <option value="CC2" v-if="!ccDisabled">CC2</option>
              <option value="CC3" v-if="!ccDisabled">CC3</option>
            </select>
            <span class="dropdown-arrow">v</span>
          </div>
        </div>

        <div class="button-group">
          <button class="btn btn-reset" @click="reset">Reset</button>
          <button class="btn btn-display" @click="display">Display</button>
        </div>
      </div>
    </div>

    <!-- Results Tabs -->
    <div v-if="hasDisplayed" class="results-container">
      <button class="back-link" @click="backToFilter">&lt;&lt; Back to Filter</button>

      <div class="collector-tabs">
        <button
          class="tab-item"
          :class="{ active: activeTab === 'overview' }"
          @click="setActiveTab('overview')"
        >
          Overview
        </button>
        <button
          class="tab-item"
          :class="{ active: activeTab === 'reconstruction' }"
          @click="setActiveTab('reconstruction')"
        >
          Reconstruction
        </button>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="tab-panel">
        <div class="mini-nav">
          <button
            v-for="item in miniNavItems"
            :key="item.key"
            class="mini-nav-item"
            :class="{ active: activeMiniNav === item.key }"
            @click="scrollToSection(item.key)"
          >
            {{ item.label }}
          </button>
        </div>

        <section ref="summarySection" id="overview-section" class="summary-section">
          <div class="summary-card">
            <div class="summary-left">
              <div class="meta-row" v-for="meta in summaryMeta" :key="meta.label">
                <span class="meta-label">{{ meta.label }}</span>
                <span class="meta-value">{{ meta.value }}</span>
              </div>
            </div>
            <div class="summary-right">
              <div class="health-pill">Healthy</div>
              <div class="metrics-row">
                <div class="metric-item">
                  <span class="metric-label">Last update</span>
                  <span class="metric-value">{{ formattedLastUpdate }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">CRC errors</span>
                  <span class="metric-value metric-green">0</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Frame lock</span>
                  <span class="metric-value metric-green">
                    <span class="dot-green"></span> Locked
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref="liveSection" id="live-section" class="live-section">
          <h3 class="section-title">Live Monitoring (mock data)</h3>
          <div class="monitoring-cards">
            <div class="monitor-card" v-for="card in liveCards" :key="card.title">
              <div class="card-header-row">
                <h4 class="card-title">{{ card.title }}</h4>
                <div class="live-indicator">
                  <span class="live-dot"></span>
                  <span class="live-text">LIVE - {{ lastUpdatedAgo }}</span>
                </div>
              </div>
              <div class="card-content">
                <div class="data-row" v-for="row in card.rows" :key="row.label">
                  <span class="data-label">
                    <span class="dot green"></span>{{ row.label }}
                  </span>
                  <span class="data-value">{{ row.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="section-divider"></div>

        <section ref="historicalSection" id="historical-section" class="historical-section">
          <div class="historical-card">
            <div class="section-header">
              <h3 class="section-title">Historical Summary (mock)</h3>
            </div>
            <div class="stat-blocks">
              <div class="stat-block">
                <p class="stat-label">Max temperature (24h)</p>
                <p class="stat-value">{{ historicalStats.maxTemp }}&deg;C</p>
              </div>
              <div class="stat-block">
                <p class="stat-label">Min VDD (24h)</p>
                <p class="stat-value">{{ historicalStats.minVdd }} V</p>
              </div>
              <div class="stat-block">
                <p class="stat-label">Max current (24h)</p>
                <p class="stat-value">{{ historicalStats.maxCurrent }} mA</p>
              </div>
              <div class="stat-block">
                <p class="stat-label">Warnings (24h)</p>
                <p class="stat-value">{{ historicalStats.warnings }}</p>
              </div>
            </div>
            <div class="historical-chart">
              <canvas ref="historicalChartRef"></canvas>
            </div>
          </div>
        </section>

        <section ref="channelsSection" id="channels-section" class="channels-section">
          <div class="section-header">
            <h3 class="section-title">Channel Overview (mock)</h3>
            <div v-if="selectedChannel" class="selected-channel">
              Selected channel: CH {{ selectedChannel.index }} (eLink {{ selectedChannel.elink }})
            </div>
          </div>
          <div class="channel-grid">
            <div
              v-for="channel in channelTiles"
              :key="channel.index"
              class="channel-tile"
              :class="{ 'channel-selected': selectedChannel && selectedChannel.index === channel.index }"
              @click="selectChannel(channel)"
            >
              <p class="channel-id">CH {{ channel.index }}</p>
              <p class="channel-meta">eLink {{ channel.elink }}</p>
              <p class="channel-meta">Hit rate: {{ channel.hitRate }} kHz</p>
              <span class="status-pill" :class="`status-${channel.status}`">{{ channel.statusLabel }}</span>
            </div>
          </div>
        </section>

        <section ref="alertsSection" id="alerts-section" class="alerts-section">
          <div class="alerts-card">
            <h3 class="section-title">Alerts & Notifications</h3>
            <div class="alerts-list">
              <div
                v-for="(alert, index) in alerts"
                :key="index"
                class="alert-row"
                :class="`alert-${alert.severity}`"
              >
                <div class="alert-meta">
                  <span class="alert-dot" :class="`alert-dot-${alert.severity}`"></span>
                  <span class="alert-severity">{{ alert.severityLabel }}</span>
                </div>
                <div class="alert-message">{{ alert.message }}</div>
                <div class="alert-time">{{ alert.time }}</div>
              </div>
            </div>
          </div>
        </section>

        <div class="actions-bar">
          <button class="btn-action btn-outline" @click="exportSummary">Export Summary</button>
          <button class="btn-action btn-outline" @click="downloadCSV">Download CSV</button>
          <button class="btn-action btn-solid" @click="toggleReconstruction">
            {{ showReconstructionGraphs ? 'Collapse Graphs' : 'Expand Graphs' }}
          </button>
        </div>
      </div>

      <!-- Reconstruction Tab -->
      <div v-else class="reconstruction-panel">
        <div class="recon-header">
          <div>
            <p class="recon-meta">
              Serenity: <span class="recon-value">{{ serenity }}</span> - CC:
              <span class="recon-value">{{ cc }}</span>
            </p>
            <p class="recon-meta">
              {{ selectedChannel ? `Focused channel: CH ${selectedChannel.index} (eLink ${selectedChannel.elink})` : 'Showing channels 1-8' }}
            </p>
          </div>
          <button class="btn-action btn-solid" @click="toggleReconstruction">
            {{ showReconstructionGraphs ? 'Collapse graphs' : 'Expand graphs' }}
          </button>
        </div>

        <div v-if="showReconstructionGraphs" class="reconstruction-cards">
          <div v-for="channel in reconChannels" :key="channel.id" class="recon-card">
            <div class="recon-card-header">
              <span>channel {{ channel.id }} - eLink {{ channel.elink }}</span>
              <span>mean={{ channel.mean.toFixed(1) }} ps, std={{ channel.std.toFixed(1) }} ps</span>
            </div>
            <div class="recon-card-body">
              <ReconstructionChart :channel-id="channel.id" :mean="channel.mean" :std="channel.std" />
            </div>
          </div>
        </div>
        <div v-else class="recon-empty">
          Graphs are hidden. Use "Expand graphs" to show TOFHIR reconstruction data.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import ReconstructionChart from './ReconstructionChart.vue'

Chart.register(...registerables)

const filterCardRef = ref(null)
const summarySection = ref(null)
const liveSection = ref(null)
const channelsSection = ref(null)
const alertsSection = ref(null)
const historicalSection = ref(null)
const historicalChartRef = ref(null)

// Filter state
const serenity = ref('')
const cc = ref('')
const ccDisabled = ref(true)
const hasDisplayed = ref(false)
const showFilter = ref(true)
const activeTab = ref('overview')
const showReconstructionGraphs = ref(true)

// Summary state
const lastUpdate = ref(new Date().toISOString())
const summaryMeta = computed(() => [
  { label: 'Serenity Board', value: serenity.value },
  { label: 'CC', value: cc.value },
  { label: 'eLinks active', value: '4 / 4' },
  { label: 'Channels', value: '48 channels' },
  { label: 'Firmware version', value: 'v1.3.2-mock' }
])

const formattedLastUpdate = computed(() => {
  const date = new Date(lastUpdate.value)
  return date.toLocaleTimeString()
})

const lastUpdatedAgo = computed(() => {
  const diff = (Date.now() - new Date(lastUpdate.value).getTime()) / 1000
  if (diff < 60) return `${Math.max(1, Math.floor(diff))}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
})

// Live monitoring state
const temps = reactive({
  tofhir: 28.3,
  lpgbt: 31.1,
  board: 26.7
})

const voltages = reactive({
  vdd: 1.2,
  vddl: 1.5,
  vbias: 45.0,
  v1v8: 1.79
})

const currents = reactive({
  avdd: 230,
  dvdd: 410,
  total: 640
})

const liveCards = computed(() => [
  {
    title: 'Temperatures',
    rows: [
      { label: 'TOFHIR temperature', value: `${temps.tofhir.toFixed(1)} degC` },
      { label: 'LPGBT temperature', value: `${temps.lpgbt.toFixed(1)} degC` },
      { label: 'Board temperature', value: `${temps.board.toFixed(1)} degC` }
    ]
  },
  {
    title: 'Voltages',
    rows: [
      { label: 'VDD', value: `${voltages.vdd.toFixed(2)} V` },
      { label: 'VDDL', value: `${voltages.vddl.toFixed(2)} V` },
      { label: 'Vbias', value: `${voltages.vbias.toFixed(1)} V` },
      { label: '1V8', value: `${voltages.v1v8.toFixed(2)} V` }
    ]
  },
  {
    title: 'Currents',
    rows: [
      { label: 'AVDD current', value: `${currents.avdd} mA` },
      { label: 'DVDD current', value: `${currents.dvdd} mA` },
      { label: 'Total board current', value: `${currents.total} mA` }
    ]
  }
])

// Reconstruction channels config
const reconChannels = [
  { id: 1, elink: 0, mean: 125.5, std: 12.3 },
  { id: 2, elink: 0, mean: 128.2, std: 11.8 },
  { id: 3, elink: 1, mean: 122.7, std: 13.1 },
  { id: 4, elink: 1, mean: 130.1, std: 12.5 },
  { id: 5, elink: 2, mean: 127.3, std: 11.9 },
  { id: 6, elink: 2, mean: 124.8, std: 12.7 },
  { id: 7, elink: 3, mean: 129.4, std: 12.1 },
  { id: 8, elink: 3, mean: 126.6, std: 12.4 }
]

// Alerts data
const alerts = reactive([
  { severity: 'info', severityLabel: 'INFO', message: 'All links stable.', time: '5 min ago' },
  {
    severity: 'warning',
    severityLabel: 'WARNING',
    message: 'Temperature approaching limit on TOFHIR0 (31.8 degC).',
    time: '12 min ago'
  },
  { severity: 'success', severityLabel: 'OK', message: 'CRC errors: 0 (last 10 min).', time: '15 min ago' },
  { severity: 'warning', severityLabel: 'WARNING', message: 'Small VDD dip detected 3h ago.', time: '3h ago' }
])

// Channel overview
const channelTiles = ref(generateChannels())
const selectedChannel = ref(null)

function generateChannels() {
  const tiles = []
  for (let i = 0; i < 48; i++) {
    const elink = Math.floor(i / 12)
    const roll = Math.random()
    let status = 'active'
    if (roll > 0.85) status = 'warning'
    else if (roll > 0.65) status = 'idle'

    tiles.push({
      index: i,
      elink,
      hitRate: (Math.random() * 60 + 40).toFixed(1),
      status,
      statusLabel: status === 'active' ? 'Active' : status === 'idle' ? 'Idle' : 'Warning'
    })
  }
  return tiles
}

const selectChannel = channel => {
  selectedChannel.value = channel
}

// Historical chart
const historicalStats = reactive({
  maxTemp: 33.4,
  minVdd: 1.18,
  maxCurrent: 662,
  warnings: 2
})

const historicalSeries = reactive({
  labels: ['-24h', '-18h', '-12h', '-6h', 'Now'],
  temperature: [29.1, 30.4, 31.2, 32.5, 31.8],
  vdd: [1.20, 1.19, 1.18, 1.19, 1.20],
  current: [620, 640, 655, 660, 645]
})

let historicalChart = null

const buildHistoricalChart = () => {
  if (!historicalChartRef.value) return
  if (historicalChart) {
    historicalChart.destroy()
  }

  historicalChart = new Chart(historicalChartRef.value, {
    type: 'line',
    data: {
      labels: historicalSeries.labels,
      datasets: [
        {
          label: 'Temperature (degC)',
          data: historicalSeries.temperature,
          borderColor: '#F97316',
          backgroundColor: 'rgba(249, 115, 22, 0.15)',
          tension: 0.3,
          fill: false
        },
        {
          label: 'VDD (V)',
          data: historicalSeries.vdd,
          borderColor: '#0EA5E9',
          backgroundColor: 'rgba(14, 165, 233, 0.15)',
          tension: 0.3,
          fill: false,
          yAxisID: 'y1'
        },
        {
          label: 'Total current (mA)',
          data: historicalSeries.current,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'Temperature / Current' },
          beginAtZero: false
        },
        y1: {
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'VDD (V)' },
          suggestedMin: 1.15,
          suggestedMax: 1.25
        }
      }
    }
  })
}

const destroyHistoricalChart = () => {
  if (historicalChart) {
    historicalChart.destroy()
    historicalChart = null
  }
}

// Filter/show logic
const miniNavItems = [
  { key: 'summary', label: 'Overview' },
  { key: 'live', label: 'Live' },
  { key: 'channels', label: 'Channels' },
  { key: 'alerts', label: 'Alerts' }
]
const activeMiniNav = ref('summary')

const sectionRefs = {
  summary: summarySection,
  live: liveSection,
  channels: channelsSection,
  alerts: alertsSection
}

let intervalId = null
let scrollSpyAttached = false

const onSerenityChange = () => {
  if (serenity.value === 'S1.2') {
    ccDisabled.value = false
  } else {
    ccDisabled.value = true
    cc.value = ''
  }
}

const reset = () => {
  serenity.value = ''
  cc.value = ''
  ccDisabled.value = true
  hasDisplayed.value = false
  showFilter.value = true
  activeTab.value = 'overview'
  selectedChannel.value = null
  showReconstructionGraphs.value = true
  destroyHistoricalChart()
  detachScrollSpy()
  if (intervalId) clearInterval(intervalId)
}

const backToFilter = () => {
  showFilter.value = true
  hasDisplayed.value = false
  activeTab.value = 'overview'
  selectedChannel.value = null
  showReconstructionGraphs.value = true
  destroyHistoricalChart()
  detachScrollSpy()
  nextTick(() => {
    filterCardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const display = () => {
  if (serenity.value === 'S1.2' && (cc.value === 'CC2' || cc.value === 'CC3')) {
    showFilter.value = false
    hasDisplayed.value = true
    activeTab.value = 'overview'
    showReconstructionGraphs.value = true
    startLiveUpdates()
    scrollToResults()
  }
}

const scrollToResults = () => {
  nextTick(() => {
    summarySection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const startLiveUpdates = () => {
  if (intervalId) clearInterval(intervalId)

  intervalId = setInterval(() => {
    temps.tofhir = parseFloat((temps.tofhir + (Math.random() - 0.5) * 0.6).toFixed(1))
    temps.lpgbt = parseFloat((temps.lpgbt + (Math.random() - 0.5) * 0.6).toFixed(1))
    temps.board = parseFloat((temps.board + (Math.random() - 0.5) * 0.6).toFixed(1))

    voltages.vdd = parseFloat((voltages.vdd + (Math.random() - 0.5) * 0.04).toFixed(2))
    voltages.vddl = parseFloat((voltages.vddl + (Math.random() - 0.5) * 0.04).toFixed(2))
    voltages.vbias = parseFloat((voltages.vbias + (Math.random() - 0.5) * 0.04).toFixed(1))
    voltages.v1v8 = parseFloat((voltages.v1v8 + (Math.random() - 0.5) * 0.04).toFixed(2))

    currents.avdd = Math.round(currents.avdd + (Math.random() - 0.5) * 20)
    currents.dvdd = Math.round(currents.dvdd + (Math.random() - 0.5) * 20)
    currents.total = Math.round(currents.total + (Math.random() - 0.5) * 30)

    lastUpdate.value = new Date().toISOString()
  }, 2000)
}

const toggleReconstruction = () => {
  showReconstructionGraphs.value = !showReconstructionGraphs.value
}

const exportSummary = () => {
  console.log('Export Summary...')
}

const downloadCSV = () => {
  console.log('Download CSV...')
}

const setActiveTab = tab => {
  activeTab.value = tab
}

const scrollToSection = key => {
  const refEl = sectionRefs[key]?.value
  if (refEl) {
    activeMiniNav.value = key
    refEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleScroll = () => {
  if (activeTab.value !== 'overview') return
  const offset = 160
  const position = window.scrollY + offset
  const sections = [
    { key: 'summary', ref: summarySection },
    { key: 'live', ref: liveSection },
    { key: 'channels', ref: channelsSection },
    { key: 'alerts', ref: alertsSection }
  ]

  for (let i = sections.length - 1; i >= 0; i--) {
    const current = sections[i]
    if (current.ref.value) {
      const top = current.ref.value.getBoundingClientRect().top + window.scrollY
      if (position >= top) {
        activeMiniNav.value = current.key
        return
      }
    }
  }
  activeMiniNav.value = 'summary'
}

const attachScrollSpy = () => {
  if (scrollSpyAttached) return
  window.addEventListener('scroll', handleScroll)
  scrollSpyAttached = true
}

const detachScrollSpy = () => {
  if (!scrollSpyAttached) return
  window.removeEventListener('scroll', handleScroll)
  scrollSpyAttached = false
}

watch(
  () => ({ displayed: hasDisplayed.value, tab: activeTab.value }),
  ({ displayed, tab }) => {
    if (displayed && tab === 'overview') {
      nextTick(() => {
        buildHistoricalChart()
        handleScroll()
      })
      attachScrollSpy()
    } else {
      detachScrollSpy()
      destroyHistoricalChart()
    }
  }
)

onMounted(() => {
  // nothing additional
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  detachScrollSpy()
  destroyHistoricalChart()
})
</script>

<style scoped>
.collector-page {
  min-height: 100vh;
  background-color: #f4f6f9;
  padding-bottom: 48px;
}

.collector-card {
  width: 900px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  margin: 40px auto 0;
  overflow: hidden;
}

.card-header {
  height: 56px;
  background-color: #cdeffc;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #b8dcf5;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.info-icon {
  font-size: 16px;
  color: #2582a4;
}

.card-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 22px;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #222;
  margin-bottom: 6px;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown {
  width: 100%;
  height: 42px;
  border: 1px solid #c8ccd1;
  border-radius: 4px;
  padding: 0 12px;
  padding-right: 32px;
  font-size: 14px;
  appearance: none;
  background: #fff;
}

.dropdown:disabled {
  background-color: #f8fafb;
  color: #a0a0a0;
  cursor: not-allowed;
}

.dropdown-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #4a4a4a;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  height: 38px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 18px;
  cursor: pointer;
}

.btn-reset {
  border: 1px solid #c5c5c5;
  background-color: #fff;
}

.btn-display {
  border: none;
  background-color: #0a9ebb;
  color: #fff;
}

.results-container {
  width: 100%;
  max-width: 1100px;
  margin: 32px auto 0;
  padding: 0 24px 32px;
  box-sizing: border-box;
}

.back-link {
  background: none;
  border: none;
  color: #0a9ebb;
  font-weight: 500;
  margin-bottom: 16px;
  cursor: pointer;
}

.collector-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}

.tab-item {
  background: none;
  border: none;
  padding: 10px 18px;
  font-size: 14px;
  cursor: pointer;
  color: #6b7280;
  border-bottom: 2px solid transparent;
}

.tab-item.active {
  color: #0a9ebb;
  border-color: #0a9ebb;
  font-weight: 600;
}

.mini-nav {
  position: sticky;
  top: 64px;
  display: flex;
  gap: 12px;
  background: #f4f6f9;
  padding: 8px 0 16px;
  z-index: 1;
}

.mini-nav-item {
  background: none;
  border: none;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: #6b7280;
  cursor: pointer;
}

.mini-nav-item.active {
  color: #0a9ebb;
  font-weight: 600;
}

.summary-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  padding: 18px 24px;
  display: flex;
  gap: 40px;
  margin-bottom: 24px;
}

.summary-left,
.summary-right {
  flex: 1;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.meta-label {
  font-size: 12px;
  color: #6b7280;
}

.meta-value {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.health-pill {
  background: #e3f7e9;
  color: #166534;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 12px;
}

.metrics-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  color: #6b7280;
  margin-right: 12px;
}

.metric-value {
  font-weight: 600;
}

.metric-green {
  color: #22c55e;
}

.dot-green {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  margin-right: 4px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2b2b2b;
}

.monitoring-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.monitor-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.live-indicator {
  font-size: 11px;
  font-weight: 600;
  color: #22c55e;
  display: flex;
  align-items: center;
  gap: 4px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s infinite;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.data-label {
  display: flex;
  align-items: center;
  color: #4a4a4a;
  gap: 6px;
}

.dot.green {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

.section-divider {
  border-top: 1px solid #e5e7eb;
  margin: 28px 0;
}

.historical-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  padding: 18px 20px;
}

.stat-blocks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.stat-block {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px 12px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.historical-chart {
  height: 260px;
}

.channels-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.selected-channel {
  font-size: 13px;
  color: #0a9ebb;
  font-weight: 500;
}

.channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.channel-tile {
  background: #f9fafb;
  border: 1px solid #e3e5ea;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.channel-tile:hover {
  background: #f1f3f7;
  box-shadow: inset 0 0 0 1px #d1d5db;
}

.channel-selected {
  border-color: #0a9ebb;
  box-shadow: 0 0 0 1px #0a9ebb inset;
}

.channel-id {
  font-weight: 600;
  margin: 0;
}

.channel-meta {
  margin: 2px 0;
  font-size: 12px;
  color: #6b7280;
}

.status-pill {
  display: inline-block;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
}

.status-active {
  background: #e3f7e9;
  color: #166534;
}

.status-idle {
  background: #e5e7eb;
  color: #374151;
}

.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.alerts-card {
  background: #fff;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-row {
  display: grid;
  grid-template-columns: 160px 1fr 80px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
}

.alert-info {
  background: #e6f3ff;
}

.alert-warning {
  background: #fff9e6;
}

.alert-success {
  background: #e6f7ed;
}

.alert-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.alert-dot-info {
  background: #0ea5e9;
}

.alert-dot-warning {
  background: #f97316;
}

.alert-dot-success {
  background: #22c55e;
}

.alert-message {
  font-size: 13px;
  color: #1f2937;
}

.alert-time {
  font-size: 12px;
  text-align: right;
  color: #6b7280;
}

.actions-bar {
  border-top: 1px solid #e5e7eb;
  margin-top: 28px;
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-action {
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 14px;
}

.btn-outline {
  background: #fff;
  border: 1px solid #d1d5db;
}

.btn-solid {
  background: #0a9ebb;
  border: none;
  color: #fff;
}

.reconstruction-panel {
  margin-top: 24px;
}

.recon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
}

.recon-meta {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
}

.recon-value {
  font-weight: 600;
  color: #111827;
}

.reconstruction-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recon-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.recon-card-header {
  background: #cdeffc;
  padding: 10px 18px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.recon-card-body {
  padding: 16px 18px;
}

.recon-empty {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: #6b7280;
  border: 1px dashed #d1d5db;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
