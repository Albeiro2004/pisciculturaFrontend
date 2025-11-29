// src/core/syncService.js

import axios from 'axios';
import db from './db';
import { getPendingMortalidades } from './mortalityService';

// URL del endpoint de sincronización de Spring Boot
const SYNC_URL = 'http://localhost:8080/api/sync/events'; 

// Nombre de la tabla local
const MORTALIDADES_TABLE = db.mortalidades;

/**
 * Intenta sincronizar todos los registros pendientes de IndexedDB con el servidor.
 */
export async function runSynchronization() {
    console.log("Iniciando intento de sincronización...");
    
    // 1. Obtener registros pendientes (usando la función de mortalityService.js)
    const pendingMortalidades = await getPendingMortalidades();

    if (pendingMortalidades.length === 0) {
        console.log("No hay registros pendientes de sincronizar.");
        return;
    }

    try {
        // 2. Preparar el cuerpo de la solicitud (SyncRequest JSON)
        const syncRequest = {
            mortalidades: pendingMortalidades.map(m => ({
                clienteId: m.clienteId,
                piscicultorId: m.piscicultorId,
                cantidad: m.cantidad,
                fecha: m.fecha // La fecha debe estar en formato ISO 8601
                // No enviamos el 'status' local
            }))
        };
        
        // Opcional: Marcar temporalmente como 'syncing' en local para evitar reenvíos
        // Esto haría el proceso más robusto, pero lo omitimos por simplicidad.

        console.log(`Enviando ${pendingMortalidades.length} registros al servidor...`);

        // 3. Enviar el lote al backend de Spring Boot
        const response = await axios.post(SYNC_URL, syncRequest);

        // La respuesta esperada es un mapa: { "clienteId_UUID": DB_ID_Long, ... }
        const syncResults = response.data;
        
        // 4. Procesar la respuesta y actualizar IndexedDB
        const updatePromises = [];
        
        for (const [clienteId, dbId] of Object.entries(syncResults)) {
            // Buscamos el registro local por el clienteId y lo actualizamos
            updatePromises.push(
                MORTALIDADES_TABLE
                    .where('clienteId').equals(clienteId)
                    .modify({ 
                        status: 'synced', // Cambiamos el estado final
                        id: dbId // Guardamos el ID final de PostgreSQL
                    })
            );
        }

        // Ejecutar todas las actualizaciones de IndexedDB simultáneamente
        await Promise.all(updatePromises);
        
        console.log(`✅ Sincronización exitosa. ${Object.keys(syncResults).length} registros actualizados.`);

        // Devolver el éxito (podría ser útil para la interfaz de usuario)
        return { success: true, count: Object.keys(syncResults).length };

    } catch (error) {
        console.error("❌ Falló la sincronización con el servidor:", error);
        // Devolver el error (los registros pendientes se mantienen en 'pending_sync')
        return { success: false, error: error.message };
    }
}

// Lógica para ejecutar la sincronización cada 30 segundos si hay conexión
// (Esto se implementaría en un hook de Vue, por ejemplo, en App.vue)

const SYNC_INTERVAL_MS = 30000; // 30 segundos

// Función para verificar la conexión (simple)
const isOnline = () => navigator.onLine;

// Bucle de polling
setInterval(() => {
    if (isOnline()) {
        runSynchronization();
    } else {
        console.log("Offline. Esperando conexión...");
    }
}, SYNC_INTERVAL_MS);

// Inicializar al cargar la app
if (isOnline()) {
    runSynchronization();
}