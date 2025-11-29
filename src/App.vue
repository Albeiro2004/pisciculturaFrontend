<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar-modern">
      <div class="navbar-container">
        <!-- Logo y Brand -->
        <router-link to="/" class="navbar-brand">
          <div class="brand-logo">
            <img src="/logo.jpeg" alt="Logo">
          </div>
        </router-link>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" @click="toggleMenu" v-if="isAuthenticated()">
          <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Desktop Navigation -->
        <div class="navbar-menu desktop-menu" v-if="isAuthenticated()">
          <router-link to="/estanque" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            <span>Estanques</span>
          </router-link>

          <router-link to="/nuevo-ciclo" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Ciclos</span>
          </router-link>

          <router-link to="/register-mortality" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span>Mortalidad</span>
          </router-link>

          <router-link to="/muestreos" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>
              <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/>
            </svg>
            <span>Muestreos</span>
          </router-link>
        </div>

        <!-- Right Side Actions -->
        <div class="navbar-actions">
          <!-- Connection Status -->
          <div class="status-indicator" :class="{ online: isOnline(), offline: !isOnline() }">
            <div class="status-dot"></div>
            <span class="status-text">{{ isOnline() ? "Online" : "Offline" }}</span>
          </div>

          <!-- Sync Status -->
          <button 
            v-if="isAuthenticated()" 
            class="sync-button" 
            :class="{ syncing: isSyncing }"
            @click="manualSync"
            :disabled="isSyncing || !isOnline()"
          >
            <svg class="sync-icon" :class="{ spinning: isSyncing }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            <span v-if="!isSyncing">Sincronizar</span>
            <span v-else>Sincronizando...</span>
          </button>

          <!-- User Menu -->
          <div class="user-menu" v-if="isAuthenticated()">
            <button class="user-button" @click="toggleUserMenu">
              <div class="user-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div class="dropdown-menu" v-show="userMenuOpen">
              <router-link to="/profile" class="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Mi Perfil</span>
              </router-link>
              <router-link to="/settings" class="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/>
                </svg>
                <span>Configuración</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <button @click="handleLogout" class="dropdown-item logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ open: mobileMenuOpen }" v-if="isAuthenticated()">
        <router-link to="/estanque" class="mobile-link" @click="closeMenu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          <span>Estanques</span>
        </router-link>

        <router-link to="/nuevo-ciclo" class="mobile-link" @click="closeMenu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Ciclos</span>
        </router-link>

        <router-link to="/register-mortality" class="mobile-link" @click="closeMenu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>Mortalidad</span>
        </router-link>

        <router-link to="/muestreos" class="mobile-link" @click="closeMenu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/>
          </svg>
          <span>Muestreos</span>
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Sync Toast Notification -->
    <transition name="toast">
      <div v-if="showSyncToast" class="sync-toast" :class="syncToastType">
        <svg v-if="syncToastType === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <svg v-else-if="syncToastType === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ syncToastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { runSynchronization } from "@/core/syncService";
import { isAuthenticated, logout } from "@/core/authService";
import { useRouter } from "vue-router";

const router = useRouter();

// Estado
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const isSyncing = ref(false);
const showSyncToast = ref(false);
const syncToastMessage = ref("");
const syncToastType = ref("success");

let syncInterval = null;
const SYNC_INTERVAL_MS = 30000; // 30 segundos

// Verificar conexión
const isOnline = () => navigator.onLine;

// Toggle menus
const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    userMenuOpen.value = false;
  }
};

const closeMenu = () => {
  mobileMenuOpen.value = false;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
  if (userMenuOpen.value) {
    mobileMenuOpen.value = false;
  }
};

// Cerrar menus al hacer click fuera
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu');
  if (userMenu && !userMenu.contains(event.target)) {
    userMenuOpen.value = false;
  }
};

// Sincronización manual
const manualSync = async () => {
  if (!isOnline() || isSyncing.value) return;
  
  isSyncing.value = true;
  try {
    await runSynchronization();
    showToast("Sincronización completada", "success");
  } catch (error) {
    showToast("Error al sincronizar", "error");
    console.error("Error en sincronización manual:", error);
  } finally {
    isSyncing.value = false;
  }
};

// Mostrar notificación toast
const showToast = (message, type = "success") => {
  syncToastMessage.value = message;
  syncToastType.value = type;
  showSyncToast.value = true;
  
  setTimeout(() => {
    showSyncToast.value = false;
  }, 3000);
};

// Sincronización automática
const startSyncPolling = () => {
  if (syncInterval) clearInterval(syncInterval);

  if (isOnline() && isAuthenticated()) {
    runSynchronization().catch(console.error);
  }

  syncInterval = setInterval(() => {
    if (isOnline() && isAuthenticated()) {
      runSynchronization().catch(console.error);
    } else {
      console.log("Offline o no autenticado. Esperando condiciones...");
    }
  }, SYNC_INTERVAL_MS);
};

// Logout
const handleLogout = () => {
  logout();
  userMenuOpen.value = false;
  router.push({ name: "Login" });
};

// Lifecycle
onMounted(() => {
  startSyncPolling();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (syncInterval) clearInterval(syncInterval);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Navbar Modern */
.navbar-modern {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 2rem;
  transition: transform 0.2s;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.brand-logo {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.brand-text {
  font-size: 1.5rem;
}

.brand-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.mobile-toggle svg {
  width: 100%;
  height: 100%;
}

/* Desktop Menu */
.desktop-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Navbar Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Status Indicator */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online .status-dot {
  background: #48bb78;
}

.status-indicator.offline .status-dot {
  background: #f56565;
}

/* Sync Button */
.sync-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.sync-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.sync-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sync-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.sync-icon.spinning {
  animation: spin 1s linear infinite;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.user-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-avatar svg {
  width: 1.25rem;
  height: 1.25rem;
}

.dropdown-arrow {
  width: 1rem;
  height: 1rem;
  color: white;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 1001;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: #1a202c;
  text-decoration: none;
  transition: background 0.2s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #f7fafc;
}

.dropdown-item svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #718096;
}

.dropdown-item.logout {
  color: #e53e3e;
}

.dropdown-item.logout svg {
  color: #e53e3e;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-menu.open {
  max-height: 500px;
  padding: 1rem;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #1a202c;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background 0.2s;
  margin-bottom: 0.5rem;
}

.mobile-link:hover {
  background: #f7fafc;
}

.mobile-link.router-link-active {
  background: #edf2f7;
  color: #667eea;
}

.mobile-link svg {
  width: 1.5rem;
  height: 1.5rem;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
}

/* Sync Toast */
.sync-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  z-index: 2000;
}

.sync-toast svg {
  width: 1.5rem;
  height: 1.5rem;
}

.sync-toast.success {
  border-left: 4px solid #48bb78;
  color: #22543d;
}

.sync-toast.success svg {
  color: #48bb78;
}

.sync-toast.error {
  border-left: 4px solid #f56565;
  color: #742a2a;
}

.sync-toast.error svg {
  color: #f56565;
}

/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(2rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-2rem);
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .desktop-menu {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }

  .mobile-menu {
    display: block;
  }

  .status-text {
    display: none;
  }

  .sync-button span {
    display: none;
  }

  .navbar-container {
    padding: 1rem;
  }

  .main-content {
    padding: 0 1rem;
  }

  .sync-toast {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
}

@media (max-width: 640px) {
  .brand-text {
    display: none;
  }

  .brand-badge {
    display: none;
  }

  .navbar-actions {
    gap: 0.5rem;
  }
}
</style>