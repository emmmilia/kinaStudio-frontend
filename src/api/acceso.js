import { getJson, postFormulario } from './cliente';

//inicia sesión y lanza error del back si los datos están mal
export function iniciarSesion(nombreUsuario, password) {
  return postFormulario('/acceso/login', { nombreUsuario, password });
}

//cierra sesión
export function cerrarSesion() {
  return postFormulario('/acceso/logout', {});
}

/**
 * devuelve el usuario con sesión iniciada con la forma { nombreUsuario, rol }
 * (rol es 'ADMINISTRADOR' o 'ESTETICISTA') o null si no hay sesión
 */
export function obtenerSesion() {
  return getJson('/acceso/yo');
}

/**
 * registra una esteticista, solo puede hacerlo un admin
 *
 * @param {{ email: string, nombreUsuario: string, password: string, nombreCompleto: string }} datos
 */
export function registrarEsteticista(datos) {
  return postFormulario('/acceso/registroEsteticista', datos);
}