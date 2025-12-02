<template>
  <div id="app" class="app-shell">
    <!-- Top Navbar -->
    <nav class="navbar top-nav" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item app-title">
          MTD Services (Mock)
        </a>
      </div>
    </nav>

    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- General -->
        <p class="menu-label sidebar-label">GENERAL</p>
        <ul class="menu-list">
          <li>
            <RouterLink class="sidebar-link" to="/">Dashboard</RouterLink>
          </li>
        </ul>

        <!-- BTL -->
        <p class="menu-label sidebar-label">BTL SERVICES</p>
        <ul class="menu-list">
          <li>
            <RouterLink class="sidebar-link" to="/btl">Dashboard</RouterLink>
          </li>
          <li>
            <RouterLink class="sidebar-link" to="/placeholder">Command</RouterLink>
          </li>
          <li>
            <RouterLink class="sidebar-link" to="/placeholder">Configurator</RouterLink>
          </li>
          <li>
            <RouterLink class="sidebar-link" to="/btl/collector">Collector</RouterLink>
          </li>
        </ul>

        <!-- ETL -->
        <p class="menu-label sidebar-label">ETL SERVICES</p>
        <ul class="menu-list">
          <li>
            <RouterLink class="sidebar-link" to="/placeholder">Dashboard</RouterLink>
          </li>
          <li>
            <RouterLink class="sidebar-link" to="/placeholder">Command</RouterLink>
          </li>
          <li>
            <RouterLink class="sidebar-link" to="/placeholder">Configurator</RouterLink>
          </li>
          <li>
            <RouterLink class="sidebar-link" to="/placeholder">Collector</RouterLink>
          </li>
        </ul>

        <!-- Advanced -->
        <p class="menu-label sidebar-label">ADVANCED</p>
        <ul class="menu-list">
          <li>
            <RouterLink class="sidebar-link" to="/placeholder">Advanced</RouterLink>
          </li>
        </ul>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
// nothing needed yet
</script>

<style>
.app-shell {
  min-height: 100vh;
  background-color: #F4F6F9;
  display: flex;
  flex-direction: column;
}

/* Top bar */
.top-nav {
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #D9DDE2;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.app-title {
  font-weight: 600;
  font-size: 18px;
}

/* Main layout */
.layout {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px);
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: #ffffff;
  border-right: 1px solid #D9DDE2;
  padding: 16px 12px;
  box-sizing: border-box;
}

.sidebar-label {
  font-size: 11px;
  letter-spacing: 1px;
  color: #8C8C8C;
  font-weight: 600;
  padding: 8px 8px 4px 8px;
}

/* Sidebar links */
.sidebar-link {
  display: block;
  height: 40px;
  line-height: 24px;
  padding: 8px 12px;
  margin: 2px 4px;
  font-size: 14px;
  color: #2B2B2B;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.sidebar-link:hover {
  background-color: #F0F2F5;
}

/* Active route style */
.sidebar-link.router-link-active {
  background-color: #E6EAF0;
  font-weight: 600;
}

/* Main content area */
.main-content {
  flex: 1;
  padding: 32px 40px;
  box-sizing: border-box;
}
</style>
