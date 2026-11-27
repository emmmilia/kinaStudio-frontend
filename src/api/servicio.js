import { borrar, getJson, postFormulario, putFormulario } from './cliente';

//arma los campos que espera el back; las listas van como ids separados por coma ("3,5")
function aFormulario(servicio) {
  return {
    nombre: servicio.nombre,
    tiempoEstimado: servicio.tiempoEstimado,
    precioBase: servicio.precioBase,
    esteticistasHabilitadas: servicio.idsEsteticistas.join(','),
    materiales: servicio.idsMateriales.join(','),
  };
}

export async function listarServicios() {
  const respuesta = await getJson('/studio/servicios');
  if (!respuesta) {
    throw new Error('Tu sesión expiró. Volvé a iniciar sesión.');
  }
  const comando = respuesta.commands?.find((item) => item.id === 'listarServicios');
  return comando?.parametro ?? [];
}

//esteticistas y materiales para elegir en el formulario (los manda el back en vistaConectada)
export async function obtenerOpcionesServicio() {
  const respuesta = await getJson('/studio/vistaConectada');
  if (!respuesta) {
    throw new Error('Tu sesión expiró. Volvé a iniciar sesión.');
  }
  const buscar = (id) => respuesta.commands?.find((item) => item.id === id)?.parametro ?? [];
  return { esteticistas: buscar('esteticistas'), materiales: buscar('materiales') };
}

export function crearServicio(servicio) {
  return postFormulario('/studio/servicios/crear', aFormulario(servicio));
}

export function modificarServicio(id, servicio) {
  return putFormulario(`/studio/servicios/${id}`, aFormulario(servicio));
}

export function eliminarServicio(id) {
  return borrar(`/studio/servicios/${id}`);
}
