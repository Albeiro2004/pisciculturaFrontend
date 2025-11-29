<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-5 shadow-lg" style="max-width: 400px; width: 100%;">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input 
            type="text" 
            class="form-control form-control-lg" 
            v-model="credentials.username" 
            required
          />
        </div>
        
        <div class="mb-4">
          <label for="password" class="form-label">Contraseña</label>
          <input 
            type="password" 
            class="form-control form-control-lg" 
            v-model="credentials.password" 
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary btn-lg w-100">
          Entrar
        </button>
      </form>
      
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { login } from '@/core/authService';
import { useRouter } from 'vue-router'; // Necesitas Vue Router para la navegación

const credentials = ref({ username: '', password: '' });
const error = ref(null);
const router = useRouter();

const handleLogin = async () => {
  error.value = null;
  try {
    const success = await login(credentials.value.username, credentials.value.password);
    
    if (success) {
      // Redirigir a la vista principal si el login es exitoso
      router.push({ name: 'Dashboard' }); 
    } else {
      error.value = 'Fallo al iniciar sesión. Intenta de nuevo.';
    }
  } catch (e) {
    // Esto captura errores de red (offline, 401, etc.)
    error.value = e.message; 
  }
};
</script>