const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

//hace el fetch al back enviando la cookie de sesión, si no hay conexión lanza error
async function pedir(ruta, opciones) {
  try {
    return await fetch(`${API_URL}${ruta}`, { credentials: 'include', ...opciones });
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está levantado el back-end?');
  }
}

//mje de error
async function mensajeDeError(respuesta) {
  if (respuesta.status === 403) {
    return 'No tenés permiso para realizar esta acción.';
  }
  const texto = await respuesta.text();
  if (texto && !texto.trimStart().startsWith('{')) {
    return texto;
  }
  if (respuesta.status === 401) {
    return 'Tu sesión expiró. Volvé a iniciar sesión.';
  }
  return 'El servidor devolvió un error.';
}

//pide el token csrf, después de iniciar o cerrar sesión cambia x eso se pide en cada pedido que modifica datos
async function obtenerCsrf() {
  const respuesta = await pedir('/acceso/csrf');
  if (!respuesta.ok) {
    throw new Error(await mensajeDeError(respuesta));
  }
  return respuesta.json();
}

/**
 * Manda un pedido que modifica datos (POST, PUT o DELETE) con el token csrf en el header.
 * Si hay datos, van como formulario.
 *
 * @param {string} metodo 'POST', 'PUT' o 'DELETE'
 * @param {string} ruta ruta del endpoint por ej '/clientes/3'
 * @param {Object<string, string>} [datos] campos del formulario
 */
async function enviarConCsrf(metodo, ruta, datos) {
  const { headerName, token } = await obtenerCsrf();

  const headers = { [headerName]: token };
  const opciones = { method: metodo, headers };
  if (datos) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    opciones.body = new URLSearchParams(datos);
  }

  const respuesta = await pedir(ruta, opciones);
  if (!respuesta.ok) {
    throw new Error(await mensajeDeError(respuesta));
  }
}

/**
 * hace un post con los datos como formulario y pide el token csrf en el header
 *
 * @param {string} ruta ruta del endpoint por ej '/acceso/login'
 * @param {Object<string, string>} datos campos del formulario
 */
export function postFormulario(ruta, datos) {
  return enviarConCsrf('POST', ruta, datos);
}

/**
 * hace un put con los datos como formulario y pide el token csrf en el header
 *
 * @param {string} ruta
 * @param {Object<string, string>} datos campos del formulario
 */
export function putFormulario(ruta, datos) {
  return enviarConCsrf('PUT', ruta, datos);
}

/**
 * hace un delete y pide el token csrf en el header
 *
 * @param {string} ruta
 */
export function borrar(ruta) {
  return enviarConCsrf('DELETE', ruta);
}

/**
 * hace un get y devuelve el JSON de la respuesta, si no hay sesión iniciada devuelve null
 *
 * @param {string} ruta
 */
export async function getJson(ruta) {
  const respuesta = await pedir(ruta);
  if (respuesta.status === 401) {
    return null;
  }
  if (!respuesta.ok) {
    throw new Error(await mensajeDeError(respuesta));
  }
  return respuesta.json();
}
