<template>
  <div class="container mt-5">
    <div class="card p-4">
      <h2 class="text-center">Registro de Mortalidad</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="cantidad" class="form-label fs-5">Cantidad de Peces Muertos</label>
          <input 
            type="number" 
            class="form-control form-control-lg" 
            id="cantidad" 
            v-model.number="form.cantidad" 
            required
            min="1"
          />
        </div>
        
        <div class="mb-4">
          <label for="piscicultorId" class="form-label">Estanque/Piscicultor ID</label>
          <input 
            type="text" 
            class="form-control" 
            id="piscicultorId" 
            v-model="form.piscicultorId" 
            required
          />
        </div>

        <button type="submit" class="btn btn-danger btn-lg w-100">
          Registrar Offline
        </button>
      </form>
      <div v-if="message" :class="['mt-3 alert', isSuccess ? 'alert-success' : 'alert-danger']">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { saveLocalMortalidad } from '@/core/mortalityService'; // Importa el servicio

const form = ref({
  cantidad: 1,
  piscicultorId: 'ESTANQUE-1',
  fecha: new Date().toISOString() // La fecha se registra automáticamente al enviar
});

const message = ref('');
const isSuccess = ref(false);

const handleSubmit = async () => {
  try {
    // Llama al servicio que se encarga de la lógica offline
    await saveLocalMortalidad(form.value);
    
    isSuccess.value = true;
    message.value = '✅ Mortalidad guardada LOCALMENTE. Se sincronizará al haber conexión.';
    
    // Resetear formulario
    form.value.cantidad = 1;
  } catch (e) {
    isSuccess.value = false;
    message.value = e.message;
  }
};
</script>