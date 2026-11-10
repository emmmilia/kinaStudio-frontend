// Se le saca la barra final (si la tiene) para no armar URLs con "//", que el back rechaza.
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

/**
 * Hace un POST con los datos como formulario (lo que espera el back con @RequestParam).
 * Si el back responde con error, lanza un Error con el mensaje que devolvió.
 *
 * @param {string} ruta Ruta del endpoint, por ejemplo '/acceso/registroEsteticista'
 * @param {Object<string, string>} datos Campos del formulario
 */
export async function postFormulario(ruta, datos) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(datos),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está levantado el back-end?');
  }

  if (!respuesta.ok) {
    const mensaje = await respuesta.text();
    throw new Error(mensaje || 'El servidor devolvió un error.');
  }
}
