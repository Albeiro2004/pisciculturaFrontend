// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <-- Importar el router

// Importar estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.css';

const app = createApp(App);

app.use(router); // <-- Usar el router

app.mount('#app');