// src/core/db.js

import Dexie from "dexie";
// 1. IMPORTAR LA CLASE MORTALIDAD
import { Mortalidad } from "./mortalidad"; // <-- Asume que el archivo se llama 'mortalidad.js'

const db = new Dexie("PisciculturaOfflineDB");

db.version(1).stores({
  mortalidades: "++id, clienteId, status, piscicultorId, cantidad, fecha",
});

// 2. Mapear el store a la clase importada
db.mortalidades.mapToClass(Mortalidad); // AHORA SÍ ESTÁ DEFINIDA

export default db;
