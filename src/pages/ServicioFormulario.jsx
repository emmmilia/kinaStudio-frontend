import { useEffect, useState } from 'react';
import { crearServicio, modificarServicio, obtenerOpcionesServicio } from '../api/servicio';
import './Materiales.css';

//convierte un servicio del back en los valores que se muestran en los campos
function camposIniciales(servicio) {
  if (!servicio) {
    return { nombre: '', tiempoEstimado: '', precioBase: '', idsEsteticistas: [], idsMateriales: [] };
  }
  return {
    nombre: servicio.nombre,
    tiempoEstimado: String(servicio.tiempoEstimado),
    precioBase: String(servicio.precioBase),
    idsEsteticistas: servicio.esteticistasHabilitadas.map((esteticista) => esteticista.id),
    idsMateriales: servicio.materiales.map((material) => material.id),
  };
}

function validar(campos) {
  if (campos.nombre.trim() === '') return 'El nombre es obligatorio.';
  if (!(Number(campos.tiempoEstimado) > 0)) return 'El tiempo estimado tiene que ser mayor a cero.';
  if (campos.precioBase === '' || Number(campos.precioBase) < 0) return 'El precio base no puede ser negativo.';
  return '';
}

/**
 * Formulario para crear un servicio (servicio = null) o modificar uno existente.
 * alGuardar recibe el mensaje de éxito; alCancelar vuelve a la lista sin guardar.
 */
export default function ServicioFormulario({ servicio, alGuardar, alCancelar }) {
  const [campos, setCampos] = useState(() => camposIniciales(servicio));
  // null = todavía cargando las esteticistas y materiales para elegir
  const [opciones, setOpciones] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    let activo = true;
    obtenerOpcionesServicio()
      .then((datos) => {
        if (activo) setOpciones(datos);
      })
      .catch((error) => {
        if (activo) setMensajeError(error instanceof Error ? error.message : 'No se pudieron cargar las opciones.');
      });
    return () => {
      activo = false;
    };
  }, []);

  function alCambiar(evento) {
    const { name, value } = evento.target;
    setCampos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  //agrega o saca un id de la lista (idsEsteticistas o idsMateriales) al tildar un checkbox
  function alternar(lista, id) {
    setCampos((anteriores) => {
      const ids = anteriores[lista];
      const nuevos = ids.includes(id) ? ids.filter((otro) => otro !== id) : [...ids, id];
      return { ...anteriores, [lista]: nuevos };
    });
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    setMensajeError('');

    const error = validar(campos);
    if (error) {
      setMensajeError(error);
      return;
    }

    const datos = { ...campos, nombre: campos.nombre.trim() };

    setEnviando(true);
    try {
      if (servicio) {
        await modificarServicio(servicio.id, datos);
        alGuardar('Servicio modificado correctamente.');
      } else {
        await crearServicio(datos);
        alGuardar('Servicio creado correctamente.');
      }
    } catch (errorDelBack) {
      setMensajeError(errorDelBack instanceof Error ? errorDelBack.message : 'Ocurrió un error inesperado.');
      setEnviando(false);
    }
  }

  const estiloOpcion = { display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' };

  return (
    <main className="materiales materiales-formulario">
      <h1>{servicio ? 'Modificar servicio' : 'Nuevo servicio'}</h1>

      <form onSubmit={alEnviar} noValidate>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" type="text" maxLength={100} value={campos.nombre} onChange={alCambiar} required />

        <label htmlFor="tiempoEstimado">Tiempo estimado (minutos)</label>
        <input
          id="tiempoEstimado"
          name="tiempoEstimado"
          type="number"
          min="1"
          step="1"
          value={campos.tiempoEstimado}
          onChange={alCambiar}
          required
        />

        <label htmlFor="precioBase">Precio base</label>
        <input
          id="precioBase"
          name="precioBase"
          type="number"
          min="0"
          max="99999999.99"
          step="0.01"
          value={campos.precioBase}
          onChange={alCambiar}
          required
        />

        {opciones === null && !mensajeError && <p>Cargando esteticistas y materiales…</p>}

        {opciones !== null && (
          <>
            <fieldset>
              <legend>Esteticistas habilitadas</legend>
              {opciones.esteticistas.length === 0 && <p>No hay esteticistas registradas.</p>}
              {opciones.esteticistas.map((esteticista) => (
                <label key={esteticista.id} style={estiloOpcion}>
                  <input
                    type="checkbox"
                    checked={campos.idsEsteticistas.includes(esteticista.id)}
                    onChange={() => alternar('idsEsteticistas', esteticista.id)}
                  />
                  {esteticista.nombreCompleto}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>Materiales que usa</legend>
              {opciones.materiales.length === 0 && <p>No hay materiales cargados.</p>}
              {opciones.materiales.map((material) => (
                <label key={material.id} style={estiloOpcion}>
                  <input
                    type="checkbox"
                    checked={campos.idsMateriales.includes(material.id)}
                    onChange={() => alternar('idsMateriales', material.id)}
                  />
                  {material.nombre} ({material.marca})
                </label>
              ))}
            </fieldset>
          </>
        )}

        <div className="botones-formulario">
          <button type="submit" disabled={enviando || opciones === null}>
            {enviando ? 'Guardando…' : 'Guardar'}
          </button>
          <button type="button" className="secundario" onClick={alCancelar} disabled={enviando}>
            Cancelar
          </button>
        </div>
      </form>

      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}
    </main>
  );
}
