<template>
  <section class="home">
    <h1 class="home-title">Dashboard</h1>

    <div class="columns is-variable is-8 is-justify-content-center mt-5">
      <!-- BTL card -->
      <div class="column is-narrow">
        <RouterLink to="/btl" class="dashboard-card">
          <div class="card-inner">
            <div class="icon-wrapper">
              <img src="../assets/BTL.png" alt="BTL Services" class="card-icon"/>
            </div>
            <p class="card-title">BTL Services</p>
          </div>
        </RouterLink>
      </div>

      <!-- ETL card -->
      <div class="column is-narrow">
        <RouterLink to="/placeholder" class="dashboard-card">
          <div class="card-inner">
            <div class="icon-wrapper">
              <img src="../assets/ETL.png" alt="ETL Services" class="card-icon"/>
            </div>
            <p class="card-title">ETL Services</p>
          </div>
        </RouterLink>
      </div>

      <!-- Advanced card -->
      <div class="column is-narrow">
        <RouterLink to="/placeholder" class="dashboard-card">
          <div class="card-inner">
            <div class="icon-wrapper">
              <img src="../assets/advanced.png" alt="Advanced" class="card-icon"/>
            </div>
            <p class="card-title">Advanced</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// purely presentational
</script>

<style scoped>
.home {
  text-align: center;
}

.home-title {
  font-size: 28px;
  font-weight: 700;
  color: #2B2B2B;
}

/* Card base */
.dashboard-card {
  display: block;
  width: 300px;
  height: 260px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #E5E5E5;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.dashboard-card:hover {
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.card-inner {
  height: 100%;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

/* Card text */
.card-title {
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
}
</style>
