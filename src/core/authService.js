// src/core/authService.js

import axios from 'axios';

// URL del endpoint de autenticación de Spring Boot
const LOGIN_URL = 'http://localhost:8080/api/auth/login'; 
const TOKEN_KEY = 'piscicultura_auth_token'; 

/**
 * Intenta iniciar sesión y almacena el token si tiene éxito.
 * @param {string} username - Nombre de usuario (o email).
 * @param {string} password - Contraseña.
 */
export async function login(username, password) {
    try {
        const response = await axios.post(LOGIN_URL, { username, password });
        
        // Asumiendo que el backend devuelve { token: "..." }
        const token = response.data.token;
        
        if (token) {
            // 1. Persistencia del Login: Guardamos el token en LocalStorage
            // ESTO PERMITE el login offline, ya que el token se carga localmente.
            localStorage.setItem(TOKEN_KEY, token); 
            // 2. Configurar Axios para enviar el token en futuras peticiones (sincronización)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error de autenticación:", error);
        throw new Error("Credenciales inválidas o error de conexión.");
    }
}

/**
 * Cierra la sesión, limpia el token y los headers de Axios.
 */
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
}

/**
 * Verifica si hay un token válido almacenado localmente para permitir el acceso offline.
 * @returns {boolean} True si hay un token, False si no lo hay.
 */
export function isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    
    // Si hay token, lo configuramos para las peticiones (login persistente)
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
    }
    return false;
}