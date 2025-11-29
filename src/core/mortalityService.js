import db from './db'; // Importa la instancia de Dexie que definimos
import { Mortalidad } from './mortalidad.js'; // Importa la clase Mortalidad
import { v4 as uuidv4 } from 'uuid'; // Importa la función para generar UUIDs

// Nombre del Objeto Store en IndexedDB
const MORTALIDADES_TABLE = db.mortalidades; 

/**
 * Registra una nueva mortalidad. Prepara el registro con un clienteId único 
 * y lo guarda en IndexedDB para el manejo offline.
 * * @param {Object} data - Objeto con los datos del formulario (piscicultorId, cantidad).
 * @returns {Promise} Una promesa de Dexie.js que resuelve cuando el dato es guardado localmente.
 */
export async function saveLocalMortalidad(data) {
    
    // 1. Generación del ID Local Único (clienteId)
    const newClienteId = uuidv4(); 
    
    // 2. Creación del objeto de Mortalidad con el estado inicial
    const newMortalidad = new Mortalidad(
        newClienteId, 
        data.piscicultorId, 
        data.cantidad, 
        data.fecha, 
        'pending_sync' // Estado CRUCIAL para la sincronización
    );

    try {
        // 3. Persistencia en IndexedDB
        // Dexie.js se encarga de las transacciones locales.
        const idLocal = await MORTALIDADES_TABLE.add(newMortalidad);
        
        console.log(`Mortalidad guardada localmente con ID local: ${idLocal} y clienteId: ${newClienteId}`);
        
        return idLocal; 
    } catch (error) {
        console.error("Error al guardar en IndexedDB:", error);
        throw new Error("No se pudo guardar el registro localmente.");
    }
}

/**
 * Obtiene todos los registros de mortalidad de la base de datos local.
 */
export async function getAllLocalMortalidades() {
    try {
        return await MORTALIDADES_TABLE.toArray();
    } catch (error) {
        console.error("Error al obtener registros locales:", error);
        return [];
    }
}

/**
 * Obtiene todos los registros pendientes de sincronizar.
 * ¡CRUCIAL para el SyncService!
 */
export async function getPendingMortalidades() {
    try {
        // Filtra solo los registros que tienen el estado 'pending_sync'
        return await MORTALIDADES_TABLE.where('status').equals('pending_sync').toArray();
    } catch (error) {
        console.error("Error al obtener pendientes de sync:", error);
        return [];
    }
}