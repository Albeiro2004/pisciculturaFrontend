<template>
  <div class="card p-4 shadow-lg">
    <h1 class="text-primary mb-4">Dashboard de Piscicultura 🐟</h1>
    
    <div class="row text-center mb-5">
      <div class="col-md-6 mb-3">
        <div class="p-3 bg-warning text-dark rounded">
          <h2 class="display-4">{{ totalPendientes }}</h2>
          <p class="lead fw-bold">Registros Pendientes de Sincronizar</p>
          <small>Se enviarán al servidor cuando haya conexión.</small>
        </div>
      </div>
      
      <div class="col-md-6 mb-3">
        <div class="p-3 bg-success text-white rounded">
          <h2 class="display-4">{{ biomasaEstimada }} kg</h2>
          <p class="lead fw-bold">Biomasa Estimada Total</p>
          <small>Basado en muestreos y mortalidades.</small>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h3>Gráfico de Crecimiento</h3>
      <div class="alert alert-info">
        Aquí se integraría un componente de librería de gráficos (ej. Chart.js) para mostrar la curva de crecimiento de la biomasa versus el tiempo.
      </div>
    </div>
    
    <router-link to="/register-mortality" class="btn btn-primary btn-lg mt-4">
      Registrar Nueva Mortalidad
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPendingMortalidades } from '@/core/mortalityService';

// Variables de estado para mostrar en la interfaz
const totalPendientes = ref(0);
const biomasaEstimada = ref(0); // Valor inicial simulado

// Función que se ejecuta al cargar la vista
onMounted(async () => {
  // Obtenemos cuántos registros están en estado 'pending_sync'
  await checkPendingCount();
  
  // Establecer un valor simulado para la biomasa
  biomasaEstimada.value = 1250; 
});

// Función para actualizar el conteo de pendientes (se puede llamar tras cada sync)
const checkPendingCount = async () => {
    try {
        const registros = await getPendingMortalidades();
        totalPendientes.value = registros.length;
    } catch (error) {
        console.error("Error al contar registros pendientes:", error);
    }
};

// Se recomienda usar un hook o un watcher para reejecutar checkPendingCount 
// después de que el syncService haya completado una sincronización.

</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>