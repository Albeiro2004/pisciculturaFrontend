<template>
    <div class="container mt-4">
        <h3 class="mb-3">Crear Nuevo Ciclo</h3>

        <form @submit.prevent="crearCiclo" class="card p-4 shadow-sm">

            <!-- Nombre del Estanque -->
            <div class="mb-3">
                <label class="form-label">Nombre del Estanque</label>
                <input v-model="form.nombreEstanque" type="text" class="form-control"
                    placeholder="Ej: Estanque 1 - Finca La Esperanza" required>
            </div>

            <!-- Especie -->
            <div class="mb-3">
                <label class="form-label">Especie</label>
                <select v-model="form.especie" class="form-select" required>
                    <option disabled value="">Seleccione una especie</option>
                    <option v-for="e in especies" :key="e" :value="e">
                        {{ e }}
                    </option>
                </select>
            </div>

            <!-- Fecha de siembra -->
            <div class="mb-3">
                <label class="form-label">Fecha de Siembra</label>
                <input v-model="form.fechaSiembra" type="date" class="form-control" required>
            </div>

            <!-- Número de alevinos -->
            <div class="mb-3">
                <label class="form-label">Número de Alevinos</label>
                <input v-model.number="form.numAlevinos" type="number" class="form-control" min="1"
                    placeholder="Ej: 500" required>
            </div>

            <!-- Peso Inicial -->
            <div class="mb-3">
                <label class="form-label">Peso Promedio Inicial (g)</label>
                <select v-model.number="form.pesoInicial" class="form-select">
                    <option :value="2">2g</option>
                    <option :value="5">5g</option>
                    <option :value="10">10g</option>
                </select>
            </div>

            <button class="btn btn-primary w-100">Guardar Ciclo</button>
        </form>

        <!-- Vista previa -->
        <div v-if="enviado" class="alert alert-success mt-3">
            Ciclo registrado correctamente.
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const especies = [
    "Tilapia roja",
    "Trucha",
    "Cachama",
    "Mojarra",
    "Bocachico",
    "Pacú"
];

const form = ref({
    nombreEstanque: "",
    especie: "",
    fechaSiembra: "",
    numAlevinos: 0,
    pesoInicial: 2, // valor por defecto
});

const enviado = ref(false);

const crearCiclo = () => {
    console.log("Datos enviados:", form.value);

    // Aquí puedes enviar los datos al backend usando fetch o axios
    // await axios.post('/api/ciclos', form.value)

    enviado.value = true;

    setTimeout(() => {
        enviado.value = false;
    }, 3000);
};
</script>

<style>
.container {
    max-width: 600px;
}
</style>
