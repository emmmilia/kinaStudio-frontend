import { postFormulario } from './cliente';

/**
 * Registra una esteticista.
 *
 * @param {{ email: string, nombreUsuario: string, password: string, nombreCompleto: string }} datos
 */
export function registrarEsteticista(datos) {
  return postFormulario('/acceso/registroEsteticista', datos);
}
