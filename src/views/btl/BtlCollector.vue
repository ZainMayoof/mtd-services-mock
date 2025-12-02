<template>
  <div class="collector-page">
    <div class="collector-card">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

const serenity = ref('')
const cc = ref('')
const ccDisabled = ref(true)

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
}

const display = () => {
  console.log('Selected:', serenity.value, cc.value)
}
</script>

<style scoped>
.collector-page {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.collector-card {
  width: 900px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* Header */
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

/* Body */
.card-body {
  padding: 24px;
}

/* Form groups */
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

/* Dropdown */
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

/* Buttons */
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
  padding: 0 18px;
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
</style>
