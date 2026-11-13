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

//pide el token csrf, después de iniciar o cerrar sesión cambia x eso se pide en cada post
async function obtenerCsrf() {
  const respuesta = await pedir('/acceso/csrf');
  if (!respuesta.ok) {
    throw new Error(await mensajeDeError(respuesta));
  }
  return respuesta.json();
}

/**
 * hace un post con los datos como formulario y pide el token csrf en el header
 *
 * @param {string} ruta ruta del endpoint por ej '/acceso/login'
 * @param {Object<string, string>} datos campos del formulario
 */
export async function postFormulario(ruta, datos) {
  const { headerName, token } = await obtenerCsrf();

  const respuesta = await pedir(ruta, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      [headerName]: token,
    },
    body: new URLSearchParams(datos),
  });

  if (!respuesta.ok) {
    throw new Error(await mensajeDeError(respuesta));
  }
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