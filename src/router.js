// src/router.js

import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '@/core/authService';

// Vistas que ya definimos o planeamos usar
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue'; 
import MortalityRegister from '@/views/MortalityRegister.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/register-mortality', name: 'MortalityRegister', component: MortalityRegister, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login, meta: { requiresAuth: false } },
  // Redirección para URLs no encontradas
  { path: '/:catchAll(.*)', redirect: '/' } 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardián Global de Navegación (CRUCIAL para el login persistente)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userIsAuthenticated = isAuthenticated(); // Verifica LocalStorage

  if (requiresAuth && !userIsAuthenticated) {
    // Si la ruta requiere autenticación y el usuario NO está autenticado, 
    // lo enviamos a la página de login.
    next({ name: 'Login' });
  } else if (to.name === 'Login' && userIsAuthenticated) {
    // Si el usuario ya está logueado e intenta ir a /login, lo redirigimos al dashboard.
    next({ name: 'Dashboard' });
  } else {
    // Continuar la navegación.
    next();
  }
});

export default router;