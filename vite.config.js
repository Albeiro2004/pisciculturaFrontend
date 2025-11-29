// vite.config.js

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// Importa utilidades para trabajar con rutas
import { fileURLToPath, URL } from 'node:url'; // O: import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  // Agrega la sección de 'resolve' para configurar el alias
  resolve: {
    alias: {
      // Definición del alias:
      // '@/' ahora apunta al directorio 'src' de tu proyecto.
      '@': fileURLToPath(new URL('./src', import.meta.url)) 
      // Si usaste la dependencia 'path' podrías usar: 
      // '@': path.resolve(__dirname, './src'), 
    }
  }
})