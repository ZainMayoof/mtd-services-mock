<template>
  <div class="collector-page">
    <!-- Filter Card (hidden when displayed) -->
    <div v-if="!hasDisplayed" class="collector-card">
      <!-- Header bar -->
      <div class="card-header">
        <div class="header-title">
          <span>MTD BTL Collector</span>
          <span class="info-icon">ⓘ</span>
        </div>
      </div>

      <!-- Card body -->
      <div class="card-body">
        <!-- Serenity board field -->
        <div class="form-group">
          <label class="field-label">Serenity board</label>
          <div class="dropdown-wrapper">
            <select v-model="serenity" class="dropdown" @change="onSerenityChange">
              <option value="" disabled selected>Select</option>
              <option value="S1.2">S1.2</option>
              <option value="Z1.1" disabled>Z1.1</option>
              <option value="Z1.2" disabled>Z1.2</option>
            </select>
            <span class="dropdown-arrow">▼</span>
          </div>
        </div>

        <!-- CC field -->
        <div class="form-group">
          <label class="field-label">CC</label>
          <div class="dropdown-wrapper">
            <select v-model="cc" class="dropdown" :disabled="ccDisabled">
              <option value="" disabled selected>Select</option>
              <option value="CC2" v-if="!ccDisabled">CC2</option>
              <option value="CC3" v-if="!ccDisabled">CC3</option>
            </select>
            <span class="dropdown-arrow">▼</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="button-group">
          <button class="btn btn-reset" @click="reset">Reset</button>
          <button class="btn btn-display" @click="display">Display</button>
        </div>
      </div>
    </div>

    <!-- Main Content Area (shown after Display - separate page) -->
    <div v-if="hasDisplayed" class="main-content">
      <!-- Back Button -->
      <div class="back-button-wrapper">
        <button class="btn-back" @click="reset">← Back to Filter</button>
      </div>
      <!-- Summary Banner -->
      <div class="summary-card">
        <div class="summary-left">
          <div class="meta-row">
            <span class="meta-label">Serenity Board</span>
            <span class="meta-value">{{ serenity }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">CC</span>
            <span class="meta-value">{{ cc }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">eLinks active</span>
            <span class="meta-value">4 / 4</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Channels</span>
            <span class="meta-value">48 channels</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Firmware version</span>
            <span class="meta-value">v1.3.2-mock</span>
          </div>
        </div>

        <div class="summary-right">
          <div class="health-pill">
            Healthy
          </div>
          <div class="metrics-row">
            <div class="metric-item">
              <span class="metric-label">Last update</span>
              <span class="metric-value">{{ lastUpdate }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">CRC errors</span>
              <span class="metric-value metric-green">0</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Frame lock</span>
              <span class="metric-value metric-green"><span class="dot-green">●</span> Locked</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Monitoring Section -->
      <div class="live-section">
        <h3 class="section-title">Live Monitoring (mock data)</h3>

        <div class="monitoring-cards">
          <!-- Temperatures Card -->
          <div class="monitor-card">
            <div class="card-header-row">
              <h4 class="card-title">Temperatures</h4>
              <div class="live-indicator">
                <span class="live-dot"></span>
                <span class="live-text">LIVE</span>
              </div>
            </div>
            <div class="card-content">
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> TOFHIR temperature</span>
                <span class="data-value">{{ temps.tofhir }} °C</span>
              </div>
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> LPGBT temperature</span>
                <span class="data-value">{{ temps.lpgbt }} °C</span>
              </div>
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> Board temperature</span>
                <span class="data-value">{{ temps.board }} °C</span>
              </div>
            </div>
          </div>

          <!-- Voltages Card -->
          <div class="monitor-card">
            <div class="card-header-row">
              <h4 class="card-title">Voltages</h4>
              <div class="live-indicator">
                <span class="live-dot"></span>
                <span class="live-text">LIVE</span>
              </div>
            </div>
            <div class="card-content">
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> VDD</span>
                <span class="data-value">{{ voltages.vdd }} V</span>
              </div>
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> VDDL</span>
                <span class="data-value">{{ voltages.vddl }} V</span>
              </div>
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> Vbias</span>
                <span class="data-value">{{ voltages.vbias }} V</span>
              </div>
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> 1V8</span>
                <span class="data-value">{{ voltages.v1v8 }} V</span>
              </div>
            </div>
          </div>

          <!-- Currents Card -->
          <div class="monitor-card">
            <div class="card-header-row">
              <h4 class="card-title">Currents</h4>
              <div class="live-indicator">
                <span class="live-dot"></span>
                <span class="live-text">LIVE</span>
              </div>
            </div>
            <div class="card-content">
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> AVDD current</span>
                <span class="data-value">{{ currents.avdd }} mA</span>
              </div>
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> DVDD current</span>
                <span class="data-value">{{ currents.dvdd }} mA</span>
              </div>
              <div class="data-row">
                <span class="data-label"><span class="dot green">●</span> Total board current</span>
                <span class="data-value">{{ currents.total }} mA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TOFHIR Reconstruction Section -->
      <div v-if="!graphsCollapsed" class="reconstruction-section">
        <h3 class="reconstruction-title">TOFHIR Reconstruction (mock)</h3>
        
        <div class="reconstruction-cards">
          <div v-for="channel in reconChannels" :key="channel.id" class="recon-card">
            <div class="recon-card-header">
              channel {{ channel.id }} – eLink {{ channel.elink }}
            </div>
            <div class="recon-card-body">
              <ReconstructionChart 
                :channel-id="channel.id" 
                :mean="channelStats[channel.id - 1].mean"
                :std="channelStats[channel.id - 1].std"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts Section -->
      <div class="alerts-section">
        <div class="alerts-card">
          <h3 class="alerts-title">Alerts & Notifications</h3>
          <div class="alerts-list">
            <div v-for="(alert, index) in alerts" :key="index" :class="['alert-item', `alert-${alert.severity}`]">
              <span :class="['alert-icon', `alert-icon-${alert.severity}`]">●</span>
              <div class="alert-content">
                <div class="alert-header">
                  <span class="alert-severity">{{ alert.severityLabel }}</span>
                  <span class="alert-time">{{ alert.time }}</span>
                </div>
                <div class="alert-message">{{ alert.message }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Footer -->
      <div class="actions-footer">
        <button class="btn-action btn-export" @click="exportSummary">Export Summary</button>
        <button class="btn-action btn-download" @click="downloadCSV">Download CSV</button>
        <button class="btn-action btn-collapse" @click="toggleGraphs">
          {{ graphsCollapsed ? 'Show Graphs' : 'Collapse Graphs' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import ReconstructionChart from './ReconstructionChart.vue'

// Filter state
const serenity = ref('')
const cc = ref('')
const ccDisabled = ref(true)
const hasDisplayed = ref(false)

// Summary state
const lastUpdate = ref(new Date().toISOString())

// Live monitoring state
const temps = reactive({
  tofhir: 28.3,
  lpgbt: 31.1,
  board: 26.7
})

const voltages = reactive({
  vdd: 1.20,
  vddl: 1.50,
  vbias: 45.0,
  v1v8: 1.79
})

const currents = reactive({
  avdd: 230,
  dvdd: 410,
  total: 640
})

// Reconstruction channels config
const reconChannels = [
  { id: 1, elink: 0 },
  { id: 2, elink: 0 },
  { id: 3, elink: 1 },
  { id: 4, elink: 1 },
  { id: 5, elink: 2 },
  { id: 6, elink: 2 },
  { id: 7, elink: 3 },
  { id: 8, elink: 3 }
]

// Channel stats (mean and std for each channel)
const channelStats = [
  { mean: 125.5, std: 12.3 },
  { mean: 128.2, std: 11.8 },
  { mean: 122.7, std: 13.1 },
  { mean: 130.1, std: 12.5 },
  { mean: 127.3, std: 11.9 },
  { mean: 124.8, std: 12.7 },
  { mean: 129.4, std: 12.1 },
  { mean: 126.6, std: 12.4 }
]

// Graphs collapsed state
const graphsCollapsed = ref(false)

// Alerts data
const alerts = reactive([
  {
    severity: 'info',
    severityLabel: 'INFO',
    message: 'All links stable.',
    time: '5 min ago'
  },
  {
    severity: 'warning',
    severityLabel: 'WARNING',
    message: 'Temperature approaching limit on TOFHIR0 (31.8 °C).',
    time: '12 min ago'
  },
  {
    severity: 'success',
    severityLabel: 'OK',
    message: 'CRC errors: 0 (last 10 min).',
    time: '15 min ago'
  },
  {
    severity: 'warning',
    severityLabel: 'WARNING',
    message: 'Small VDD dip detected 3h ago.',
    time: '3h ago'
  }
])

let intervalId = null

// Dropdown handlers
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
}

const display = () => {
  if (serenity.value === 'S1.2' && (cc.value === 'CC2' || cc.value === 'CC3')) {
    hasDisplayed.value = true
    console.log('Selected:', serenity.value, cc.value)
    startLiveUpdates()
  }
}

// Live data updates
const startLiveUpdates = () => {
  if (intervalId) clearInterval(intervalId)
  
  intervalId = setInterval(() => {
    // Update temperatures (±0.3°C)
    temps.tofhir = parseFloat((temps.tofhir + (Math.random() - 0.5) * 0.6).toFixed(1))
    temps.lpgbt = parseFloat((temps.lpgbt + (Math.random() - 0.5) * 0.6).toFixed(1))
    temps.board = parseFloat((temps.board + (Math.random() - 0.5) * 0.6).toFixed(1))

    // Update voltages (±0.02V)
    voltages.vdd = parseFloat((voltages.vdd + (Math.random() - 0.5) * 0.04).toFixed(2))
    voltages.vddl = parseFloat((voltages.vddl + (Math.random() - 0.5) * 0.04).toFixed(2))
    voltages.vbias = parseFloat((voltages.vbias + (Math.random() - 0.5) * 0.04).toFixed(1))
    voltages.v1v8 = parseFloat((voltages.v1v8 + (Math.random() - 0.5) * 0.04).toFixed(2))

    // Update currents (±10mA)
    currents.avdd = Math.round(currents.avdd + (Math.random() - 0.5) * 20)
    currents.dvdd = Math.round(currents.dvdd + (Math.random() - 0.5) * 20)
    currents.total = Math.round(currents.total + (Math.random() - 0.5) * 30)

    // Update timestamp
    lastUpdate.value = new Date().toISOString()
  }, 2000)
}

// Actions footer functions
const toggleGraphs = () => {
  graphsCollapsed.value = !graphsCollapsed.value
}

const exportSummary = () => {
  console.log('Export Summary...')
}

const downloadCSV = () => {
  console.log('Download CSV...')
}

onMounted(() => {
  // Cleanup handled in onUnmounted
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
/* General */
.collector-page {
  padding: 0;
  min-height: 100vh;
  background-color: #F4F6F9;
}

/* Filter Card */
.collector-card {
  width: 900px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin: 40px auto 0;
}

.card-header {
  height: 56px;
  background-color: #CDEFFC;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #B8DCF5;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}

.info-icon {
  font-size: 16px;
  color: #2582A4;
  cursor: help;
}

.card-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 22px;
}

.form-group:last-of-type {
  margin-bottom: 0;
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
  display: flex;
  align-items: center;
}

.dropdown {
  width: 100%;
  height: 42px;
  border: 1px solid #C8CCD1;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  padding: 0 12px;
  padding-right: 32px;
  color: #2B2B2B;
  appearance: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.dropdown:hover:not(:disabled) {
  background-color: #F8FAFB;
}

.dropdown:disabled {
  color: #A0A0A0;
  cursor: not-allowed;
  background-color: #F8FAFB;
}

.dropdown-arrow {
  position: absolute;
  right: 12px;
  color: #4A4A4A;
  font-size: 12px;
  pointer-events: none;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 12px;
}

.btn {
  height: 38px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 18px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.btn-reset {
  border: 1px solid #C5C5C5;
  background-color: #FFFFFF;
  color: #2B2B2B;
}

.btn-reset:hover {
  background-color: #F3F4F6;
}

.btn-display {
  background-color: #0A9EBB;
  color: white;
  padding: 0 20px;
}

.btn-display:hover {
  background-color: #0C8CA6;
}

/* Main Content */
.main-content {
  padding: 24px;
  min-height: 100vh;
}

.back-button-wrapper {
  margin-bottom: 24px;
}

.btn-back {
  background-color: transparent;
  color: #0A9EBB;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.btn-back:hover {
  color: #0C8CA6;
}

/* Summary Banner */
.summary-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.06);
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 24px;
}

.summary-left {
  flex: 1;
}

.summary-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}

.meta-label {
  font-size: 12px;
  color: #7A7A7A;
  margin-right: 16px;
}

.meta-value {
  font-size: 15px;
  color: #1F1F1F;
  font-weight: 600;
}

.health-pill {
  background-color: #E3F7E9;
  color: #1E7A3C;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
  display: inline-block;
}

.metrics-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.metric-label {
  color: #7A7A7A;
  margin-right: 12px;
}

.metric-value {
  color: #1F1F1F;
  font-weight: 600;
}

.metric-green {
  color: #22C55E;
}

.dot-green {
  margin-right: 4px;
}

/* Live Monitoring Section */
.live-section {
  margin-top: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2B2B2B;
  margin: 0 0 12px 0;
}

.monitoring-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.monitor-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04);
  padding: 16px 18px;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #2B2B2B;
  margin: 0;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #22C55E;
  font-weight: 600;
}

.live-dot {
  width: 6px;
  height: 6px;
  background-color: #22C55E;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.live-text {
  letter-spacing: 0.5px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.data-label {
  display: flex;
  align-items: center;
  color: #4A4A4A;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  display: inline-block;
}

.dot.green {
  background-color: #22C55E;
}

.data-value {
  font-weight: 600;
  color: #1F1F1F;
}

/* TOFHIR Reconstruction Section */
.reconstruction-section {
  margin-top: 32px;
}

.reconstruction-title {
  font-size: 18px;
  font-weight: 600;
  color: #2B2B2B;
  margin: 0 0 16px 0;
}

.reconstruction-cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.recon-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.recon-card-header {
  height: 42px;
  background-color: #CDEFFC;
  padding: 0 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
}

.recon-card-body {
  padding: 16px;
  background-color: #FFFFFF;
}

/* Alerts Section */
.alerts-section {
  margin-top: 24px;
}

.alerts-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.06);
  padding: 16px 18px;
}

.alerts-title {
  font-size: 18px;
  font-weight: 600;
  color: #2B2B2B;
  margin: 0 0 16px 0;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 4px;
}

.alert-item.alert-info {
  background-color: #E6F3FF;
}

.alert-item.alert-warning {
  background-color: #FFF9E6;
}

.alert-item.alert-success {
  background-color: #E6F7ED;
}

.alert-icon {
  font-size: 12px;
  margin-top: 2px;
}

.alert-icon-info {
  color: #2582A4;
}

.alert-icon-warning {
  color: #F59E0B;
}

.alert-icon-success {
  color: #22C55E;
}

.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-severity {
  font-size: 12px;
  font-weight: 600;
  color: #4A4A4A;
}

.alert-time {
  font-size: 11px;
  color: #7A7A7A;
}

.alert-message {
  font-size: 13px;
  color: #2B2B2B;
}

/* Actions Footer */
.actions-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-bottom: 24px;
}

.btn-action {
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.btn-export,
.btn-download {
  background-color: #FFFFFF;
  border: 1px solid #C5C5C5;
  color: #2B2B2B;
  padding: 6px 14px;
}

.btn-export:hover,
.btn-download:hover {
  background-color: #F8FAFB;
}

.btn-collapse {
  background-color: #0A9EBB;
  color: white;
  padding: 6px 16px;
}

.btn-collapse:hover {
  background-color: #0C8CA6;
}
</style>
