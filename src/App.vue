<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">🐟 Piscicultura App</router-link>
      <div class="d-flex">
        <span
          class="badge me-3"
          :class="isOnline() ? 'bg-success' : 'bg-danger'"
        >
          {{ isOnline() ? "✅ Online" : "❌ Offline" }}
        </span>
        <div v-if="isAuthenticated()">
          <router-link
            to="/estanque"
            class="btn btn-sm btn-warnning me-2"
          >
            Estanques
          </router-link>
          <router-link
            to="/nuevo-ciclo"
            class="btn btn-sm btn-primary me-2"
          >
            Ciclos
          </router-link>
          <router-link
            to="/register-mortality"
            class="btn btn-sm btn-light me-2"
          >
            Registrar Mortalidad
          </router-link>
          <button @click="handleLogout" class="btn btn-sm btn-warning">
            Salir
          </button>
        </div>
      </div>
    </div>
  </nav>

  <main class="container mt-4">
    <router-view />
  </main>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { runSynchronization } from "@/core/syncService"; // Importar la lógica de sync
import { isAuthenticated, logout } from "@/core/authService";
import { useRouter } from "vue-router";

const router = useRouter();
let syncInterval = null;
const SYNC_INTERVAL_MS = 30000; // 30 segundos

// Función simple para verificar si estamos online
const isOnline = () => navigator.onLine;

// Lógica de sincronización en segundo plano
const startSyncPolling = () => {
  // Si ya existe, lo limpiamos para evitar duplicados
  if (syncInterval) clearInterval(syncInterval);

  // Inicializar al cargar la app
  if (isOnline()) {
    runSynchronization();
  }

  // Bucle de polling
  syncInterval = setInterval(() => {
    if (isOnline() && isAuthenticated()) {
      runSynchronization();
    } else {
      console.log("Offline o no autenticado. Esperando condiciones...");
    }
  }, SYNC_INTERVAL_MS);
};

// Limpiar el polling al salir del componente (buena práctica)
onUnmounted(() => {
  if (syncInterval) clearInterval(syncInterval);
});

// Iniciar el polling cuando el componente se monta
onMounted(() => {
  // Esto se ejecutará una vez que la app esté cargada
  startSyncPolling();
});

const handleLogout = () => {
  logout();
  router.push({ name: "Login" });
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
