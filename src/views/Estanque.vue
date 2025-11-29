<template>
  <div class="max-w-4xl mx-auto">
    
    <header class="mb-8 text-center bg-white p-6 rounded-xl shadow-lg border-b-4 border-emerald-500">
      <h1 class="text-3xl font-extrabold text-gray-800 flex items-center justify-center">
        <!-- Icono de Estanque (simulado con SVG de Layout) -->
        <svg class="icon w-8 h-8 mr-3 text-emerald-600" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
        Gestión de Estanques
      </h1>
      <p class="text-gray-500 mt-2">
        Crea, edita y elimina tus cuerpos de agua para el cultivo.
      </p>
    </header>

    <!-- Formulario de Creación/Edición -->
    <section class="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
        {{ isEditing ? 'Editar Estanque' : 'Crear Nuevo Estanque' }}
      </h2>
      <form @submit.prevent="saveEstanque" class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        
        <!-- Nombre del Estanque -->
        <div class="sm:col-span-1">
          <label for="nombre" class="text-sm font-medium text-gray-700 block mb-1">Nombre (*)</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="form.nombre" 
            required 
            placeholder="Estanque 1 - La Esperanza"
            class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
        </div>
        
        <!-- Área (m2) -->
        <div class="sm:col-span-1">
          <label for="area_m2" class="text-sm font-medium text-gray-700 block mb-1">Área (m²)</label>
          <input 
            type="number" 
            id="area_m2" 
            v-model.number="form.area_m2" 
            placeholder="Ej: 500.5"
            min="0" 
            step="0.01"
            class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
        </div>

        <!-- Botón de Acción -->
        <div class="sm:col-span-1">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full p-2 text-white font-semibold rounded-lg shadow-md transition duration-200 hover:scale-[1.01]"
            :class="isLoading ? 'bg-gray-400 cursor-not-allowed' : (isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-600 hover:bg-emerald-700')"
          >
            {{ isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Estanque' : 'Crear Estanque') }}
          </button>
        </div>
      </form>
      <button 
        v-if="isEditing" 
        @click="cancelEdit"
        class="mt-2 w-full sm:w-auto px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg shadow-sm transition duration-200 hover:bg-gray-50"
      >
        Cancelar Edición
      </button>
    </section>

    <!-- Lista de Estanques -->
    <section class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 flex justify-between items-center">
        Estanques Registrados ({{ estanques.length }})
        <span v-if="isLoading" class="text-sm text-yellow-600 flex items-center">
          <svg class="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando...
        </span>
      </h2>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <div v-if="estanques.length === 0 && !isLoading" class="text-center py-10 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="6"/>
          <line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
          <line x1="2" y1="12" x2="6" y2="12"/>
          <line x1="18" y1="12" x2="22" y2="12"/>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <p>No hay estanques registrados aún. ¡Comienza creando uno!</p>
      </div>

      <!-- Tabla de Estanques (Vista de Escritorio) -->
      <div class="hidden sm:block">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Área (m²)</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="estanque in estanques" :key="estanque.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ estanque.nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ estanque.area_m2 || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="startEdit(estanque)" class="text-blue-600 hover:text-blue-900 transition duration-150">
                  Editar
                </button>
                <button @click="deleteEstanque(estanque.id, estanque.nombre)" class="text-red-600 hover:text-red-900 transition duration-150">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tarjetas de Estanques (Vista Móvil) -->
      <div class="sm:hidden space-y-4">
        <div v-for="estanque in estanques" :key="estanque.id" class="bg-gray-50 p-4 rounded-lg shadow-md border-l-4 border-emerald-500">
          <div class="text-lg font-bold text-gray-800 mb-2">{{ estanque.nombre }}</div>
          <div class="text-sm text-gray-600 mb-3">Área: <span class="font-medium">{{ estanque.area_m2 || 'No especificada' }} m²</span></div>
          <div class="flex justify-end space-x-3">
            <button @click="startEdit(estanque)" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full transition duration-150 hover:bg-blue-200">
              Editar
            </button>
            <button @click="deleteEstanque(estanque.id, estanque.nombre)" class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full transition duration-150 hover:bg-red-200">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
        <h3 class="text-xl font-bold text-red-600 mb-4">Confirmar Eliminación</h3>
        <p class="text-gray-700 mb-6">
          ¿Estás seguro de que deseas eliminar el estanque **{{ estanqueToDeleteName }}**?
          Esta acción es irreversible y eliminará todos sus datos de ciclo asociados.
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg transition hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button 
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg transition hover:bg-red-700"
          >
            Eliminar Permanentemente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

// --- Configuración de la API ---
// Ajusta esta URL a tu backend
const API_BASE_URL = 'http://localhost:3000/api/estanques';

const estanques = ref([]);
const isLoading = ref(false);
const isAuthReady = ref(true); // Siempre ready cuando usamos API
const error = ref('');

// --- Estado del Formulario ---
const form = reactive({
  id: null,
  nombre: '',
  area_m2: null
});
const isEditing = ref(false);

// --- Estado del Modal de Eliminación ---
const showDeleteModal = ref(false);
const estanqueToDeleteId = ref(null);
const estanqueToDeleteName = ref('');

// --- 1. Inicialización ---
onMounted(async () => {
  await loadEstanques();
});

// --- 2. Read (Lectura de datos) ---
const loadEstanques = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    estanques.value = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } catch (e) {
    console.error("Error al cargar estanques:", e);
    error.value = `Error de carga de datos: ${e.response?.data?.message || e.message}`;
  } finally {
    isLoading.value = false;
  }
};

// --- 3. Create (Creación) y Update (Actualización) ---
const saveEstanque = async () => {
  if (isLoading.value) return;
  
  if (!form.nombre.trim()) {
    error.value = "El nombre del estanque es obligatorio.";
    return;
  }
  
  // Asegurar que area_m2 sea nulo si está vacío o 0
  const dataToSave = {
    nombre: form.nombre.trim(),
    area_m2: form.area_m2 > 0 ? form.area_m2 : null
  };

  isLoading.value = true;
  error.value = '';

  try {
    if (isEditing.value) {
      // Actualización (PUT o PATCH)
      await axios.put(`${API_BASE_URL}/${form.id}`, dataToSave);
      console.log("Estanque actualizado con ID:", form.id);
    } else {
      // Creación (POST)
      await axios.post(API_BASE_URL, dataToSave);
      console.log("Nuevo estanque creado.");
    }
    
    // Recargar la lista de estanques
    await loadEstanques();
    
    // Limpiar formulario y estados
    resetForm();

  } catch (e) {
    console.error("Error al guardar estanque:", e);
    error.value = `Error al guardar: ${e.response?.data?.message || e.message}`;
  } finally {
    isLoading.value = false;
  }
};

// --- Funciones de Edición ---
const startEdit = (estanque) => {
  isEditing.value = true;
  form.id = estanque.id;
  form.nombre = estanque.nombre;
  form.area_m2 = estanque.area_m2 || null;
  error.value = '';
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  form.id = null;
  form.nombre = '';
  form.area_m2 = null;
  isEditing.value = false;
  isLoading.value = false;
};

// --- 4. Delete (Eliminación) ---
const deleteEstanque = (id, name) => {
  estanqueToDeleteId.value = id;
  estanqueToDeleteName.value = name;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!estanqueToDeleteId.value) return;
  
  showDeleteModal.value = false;
  isLoading.value = true;
  error.value = '';
  
  try {
    await axios.delete(`${API_BASE_URL}/${estanqueToDeleteId.value}`);
    console.log("Estanque eliminado con ID:", estanqueToDeleteId.value);
    
    // Recargar la lista de estanques
    await loadEstanques();
    
    // Si el estanque eliminado era el que se estaba editando, resetear el formulario
    if (form.id === estanqueToDeleteId.value) {
      resetForm();
    }
    
    // Resetear ID de eliminación
    estanqueToDeleteId.value = null;
    estanqueToDeleteName.value = '';

  } catch (e) {
    console.error("Error al eliminar estanque:", e);
    error.value = `Error al eliminar: ${e.response?.data?.message || e.message}`;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.icon {
  stroke: currentColor;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>