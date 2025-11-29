// src/core/Mortalidad.js

export class Mortalidad {
    constructor(clienteId, piscicultorId, cantidad, fecha, status) {
        this.clienteId = clienteId; // El UUID generado localmente
        this.piscicultorId = piscicultorId;
        this.cantidad = cantidad;
        this.fecha = fecha || new Date().toISOString();
        this.status = status || 'pending_sync'; // Estado inicial
        this.id = undefined; // ID de PostgreSQL (se llenará tras la sincronización)
    }
}