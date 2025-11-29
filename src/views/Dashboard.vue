<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div>
          <h1 class="dashboard-title">
            <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            Dashboard de Piscicultura
          </h1>
          <p class="dashboard-subtitle">Monitoreo y control en tiempo real</p>
        </div>
        <div class="sync-status" :class="{ 'synced': totalPendientes === 0 }">
          <svg v-if="totalPendientes === 0" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <svg v-else class="status-icon animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ totalPendientes === 0 ? 'Sincronizado' : 'Pendiente de sincronizar' }}</span>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <!-- Registros Pendientes -->
      <div class="kpi-card warning-card">
        <div class="kpi-icon-wrapper warning">
          <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">{{ totalPendientes }}</div>
          <div class="kpi-label">Registros Pendientes</div>
          <div class="kpi-description">Se sincronizarán automáticamente</div>
        </div>
        <div class="kpi-trend" v-if="totalPendientes > 0">
          <span class="trend-badge warning">⚠️ Requiere sincronización</span>
        </div>
      </div>

      <!-- Biomasa Estimada -->
      <div class="kpi-card success-card">
        <div class="kpi-icon-wrapper success">
          <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">{{ formatNumber(biomasaEstimada) }} <span class="kpi-unit">kg</span></div>
          <div class="kpi-label">Biomasa Estimada</div>
          <div class="kpi-description">Total en producción</div>
        </div>
        <div class="kpi-trend">
          <span class="trend-badge success">↗ +8.5% vs mes anterior</span>
        </div>
      </div>

      <!-- Estanques Activos -->
      <div class="kpi-card info-card">
        <div class="kpi-icon-wrapper info">
          <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">8</div>
          <div class="kpi-label">Estanques Activos</div>
          <div class="kpi-description">Con ciclos en curso</div>
        </div>
        <div class="kpi-trend">
          <span class="trend-badge info">🏊 En operación</span>
        </div>
      </div>

      <!-- Tasa de Supervivencia -->
      <div class="kpi-card primary-card">
        <div class="kpi-icon-wrapper primary">
          <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">94.2<span class="kpi-unit">%</span></div>
          <div class="kpi-label">Tasa de Supervivencia</div>
          <div class="kpi-description">Promedio general</div>
        </div>
        <div class="kpi-trend">
          <span class="trend-badge success">✓ Óptimo</span>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-section">
      <div class="chart-header">
        <div>
          <h3 class="chart-title">Análisis de Crecimiento</h3>
          <p class="chart-subtitle">Evolución de la biomasa en los últimos 6 meses</p>
        </div>
        <div class="chart-controls">
          <button class="chart-btn active">6M</button>
          <button class="chart-btn">3M</button>
          <button class="chart-btn">1M</button>
        </div>
      </div>
      <div class="chart-placeholder">
        <svg class="chart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <p class="chart-message">Gráfico de tendencias</p>
        <small class="chart-hint">Integrar Chart.js o similar para visualización de datos</small>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="actions-section">
      <h3 class="actions-title">Acciones Rápidas</h3>
      <div class="actions-grid">
        <router-link to="/estanque" class="action-card">
          <div class="action-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </div>
          <div class="action-content">
            <div class="action-label">Gestionar Estanques</div>
            <div class="action-description">Ver y administrar tus estanques</div>
          </div>
          <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </router-link>

        <router-link to="/nuevo-ciclo" class="action-card">
          <div class="action-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="action-content">
            <div class="action-label">Iniciar Nuevo Ciclo</div>
            <div class="action-description">Comenzar ciclo de producción</div>
          </div>
          <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </router-link>

        <router-link to="/register-mortality" class="action-card">
          <div class="action-icon red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <div class="action-content">
            <div class="action-label">Registrar Mortalidad</div>
            <div class="action-description">Documentar eventos de mortalidad</div>
          </div>
          <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </router-link>

        <router-link to="/muestreos" class="action-card">
          <div class="action-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>
              <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/>
            </svg>
          </div>
          <div class="action-content">
            <div class="action-label">Ver Muestreos</div>
            <div class="action-description">Consultar historial de muestreos</div>
          </div>
          <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="activity-header">
        <h3 class="activity-title">Actividad Reciente</h3>
        <button class="view-all-btn">Ver todo</button>
      </div>
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-text">Muestreo completado en Estanque #3</div>
            <div class="activity-time">Hace 2 horas</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-text">Nuevo ciclo iniciado en Estanque #7</div>
            <div class="activity-time">Hace 5 horas</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-text">Mortalidad registrada: 15 unidades</div>
            <div class="activity-time">Hace 1 día</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPendingMortalidades } from '@/core/mortalityService';

// Variables de estado
const totalPendientes = ref(0);
const biomasaEstimada = ref(0);

// Función para formatear números
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CO').format(num);
};

// Cargar datos al montar el componente
onMounted(async () => {
  await checkPendingCount();
  biomasaEstimada.value = 1250;
});

// Verificar registros pendientes
const checkPendingCount = async () => {
  try {
    const registros = await getPendingMortalidades();
    totalPendientes.value = registros.length;
  } catch (error) {
    console.error("Error al contar registros pendientes:", error);
  }
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

/* Header */
.dashboard-header {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.title-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #667eea;
}

.dashboard-subtitle {
  color: #718096;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #fef5e7;
  border: 1px solid #f8c471;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #d68910;
}

.sync-status.synced {
  background: #d5f5e3;
  border-color: #52be80;
  color: #1e8449;
}

.status-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-color) 0%, var(--card-color-light) 100%);
}

.warning-card { --card-color: #f39c12; --card-color-light: #f8c471; }
.success-card { --card-color: #27ae60; --card-color-light: #52be80; }
.info-card { --card-color: #3498db; --card-color-light: #5dade2; }
.primary-card { --card-color: #8e44ad; --card-color-light: #a569bd; }

.kpi-icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.kpi-icon-wrapper.warning { background: #fef5e7; color: #f39c12; }
.kpi-icon-wrapper.success { background: #d5f5e3; color: #27ae60; }
.kpi-icon-wrapper.info { background: #ebf5fb; color: #3498db; }
.kpi-icon-wrapper.primary { background: #f4ecf7; color: #8e44ad; }

.kpi-icon {
  width: 2rem;
  height: 2rem;
}

.kpi-content {
  margin-bottom: 1rem;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
}

.kpi-unit {
  font-size: 1.5rem;
  font-weight: 400;
  color: #718096;
}

.kpi-label {
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
  margin-top: 0.5rem;
}

.kpi-description {
  font-size: 0.875rem;
  color: #a0aec0;
  margin-top: 0.25rem;
}

.kpi-trend {
  display: flex;
  justify-content: flex-end;
}

.trend-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
}

.trend-badge.success { background: #d5f5e3; color: #1e8449; }
.trend-badge.warning { background: #fef5e7; color: #d68910; }
.trend-badge.info { background: #ebf5fb; color: #1a5490; }

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.chart-subtitle {
  color: #718096;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
}

.chart-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 0.5rem;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.chart-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.chart-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.chart-placeholder {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 0.75rem;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.chart-icon {
  width: 4rem;
  height: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.chart-message {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0;
}

.chart-hint {
  color: #a0aec0;
  margin-top: 0.5rem;
}

/* Actions Section */
.actions-section {
  margin-bottom: 2rem;
}

.actions-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.action-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.action-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.action-icon.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.action-icon.green { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); }
.action-icon.red { background: linear-gradient(135deg, #fc8181 0%, #f56565 100%); }
.action-icon.purple { background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%); }

.action-content {
  flex: 1;
}

.action-label {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.action-description {
  font-size: 0.875rem;
  color: #718096;
}

.action-arrow {
  width: 1.25rem;
  height: 1.25rem;
  color: #cbd5e0;
  flex-shrink: 0;
}

/* Activity Section */
.activity-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.activity-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.view-all-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.view-all-btn:hover {
  color: #764ba2;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.activity-item:hover {
  background: #edf2f7;
}

.activity-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.activity-icon.success { background: #d5f5e3; color: #27ae60; }
.activity-icon.info { background: #ebf5fb; color: #3498db; }
.activity-icon.warning { background: #fef5e7; color: #f39c12; }

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #a0aec0;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 1.5rem;
  }

  .title-icon {
    width: 2rem;
    height: 2rem;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .chart-placeholder {
    padding: 2rem 1rem;
    min-height: 200px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>