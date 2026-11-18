import { getJson, postFormulario } from './cliente';

// inicia sesión y lanza el error del back si los datos están mal
export function iniciarSesion(nombreUsuario, password) {
  return postFormulario('/acceso/login', { nombreUsuario, password });
}

// cierra sesión
export function cerrarSesion() {
  return postFormulario('/acceso/logout', {});
}

export function obtenerSesion() {
  return getJson('/acceso/yo');
}

export function restablecerPassword(token, passwordNueva) {
  return postFormulario('/acceso/restablecerPassword', { token, passwordNueva });
}

export function recuperarPassword(email) {
  return postFormulario('/acceso/recuperarPassword', { email });
}

/**
 * Registra una esteticista, solo puede hacerlo un admin.
 *
 * @param {{ email: string, nombreUsuario: string, password: string, nombreCompleto: string }} datos
 */
export function registrarEsteticista(datos) {
  return postFormulario('/acceso/registroEsteticista', datos);
}

export function cambiarPassword(passwordActual, passwordNueva) {
  return postFormulario('/acceso/cambiarPassword', { passwordActual, passwordNueva });
}

/**
 * Modifica los datos del usuario con sesión iniciada.
 *
 * @param {{ email: string, nombreCompleto: string, comentario: string }} datos
 */
export function modificarPerfil(datos) {
  return postFormulario('/acceso/perfil', datos);
}

export function obtenerPerfil() {
  return getJson('/acceso/perfil');
}

