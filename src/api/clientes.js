import { borrar, getJson, postFormulario, putFormulario } from './cliente';

/**
 * Devuelve la lista de clientes del estudio.
 *
 * @returns {Promise<Array<{ id: number, nombreCompleto: string, email: string, telefono: string, notas: string, saldoAFavor: number }>>}
 */
export function listarClientes() {
  return getJson('/clientes');
}

/**
 * Registra un cliente nuevo.
 *
 * @param {{ nombreCompleto: string, email: string, telefono: string, notas: string }} datos
 */
export function registrarCliente(datos) {
  return postFormulario('/clientes/crear', datos);
}

/**
 * Modifica los datos de un cliente.
 *
 * @param {number} id
 * @param {{ nombreCompleto: string, email: string, telefono: string, notas: string }} datos
 */
export function modificarCliente(id, datos) {
  return putFormulario(`/clientes/${id}`, datos);
}

/**
 * Elimina un cliente.
 *
 * @param {number} id
 */
export function eliminarCliente(id) {
  return borrar(`/clientes/${id}`);
}
