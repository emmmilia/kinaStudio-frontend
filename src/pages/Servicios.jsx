import { useEffect, useState } from 'react';
import { eliminarServicio, listarServicios } from '../api/servicio';
import ServicioFormulario from './ServicioFormulario';
import './Materiales.css';

const formatoPrecio = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' });

function mensajeDe(error) {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

//junta los nombres de una lista en un texto, o un guion si está vacía
function nombresDe(lista, campo) {
  return lista.length === 0 ? '—' : lista.map((item) => item[campo]).join(', ');
}

export default function Servicios() {
  // null = todavía cargando la lista
  const [servicios, setServicios] = useState(null);
  const [errorCarga, setErrorCarga] = useState('');
  const [busqueda, setBusqueda] = useState('');
  // null = se muestra la lista; { servicio: null } = alta; { servicio: {...} } = modificación
  const [formulario, setFormulario] = useState(null);
  const [mensajeOk, setMensajeOk] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  // id del servicio que está pidiendo confirmación para eliminar
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  //lista que se carga al abrir la pantalla
  useEffect(() => {
    let activo = true;
    listarServicios()
      .then((lista) => {
        if (activo) setServicios(lista);
      })
      .catch((error) => {
        if (activo) setErrorCarga(mensajeDe(error));
      });
    return () => {
      activo = false;
    };
  }, []);

  async function recargar() {
    try {
      setServicios(await listarServicios());
      setErrorCarga('');
    } catch (error) {
      setErrorCarga(mensajeDe(error));
    }
  }

  async function alGuardar(mensaje) {
    setFormulario(null);
    setMensajeError('');
    setMensajeOk(mensaje);
    await recargar();
  }

  async function alEliminar(servicio) {
    setMensajeOk('');
    setMensajeError('');
    setEliminando(true);
    try {
      await eliminarServicio(servicio.id);
      setConfirmandoId(null);
      setMensajeOk(`Servicio "${servicio.nombre}" eliminado.`);
      await recargar();
    } catch (error) {
      setMensajeError(mensajeDe(error));
    } finally {
      setEliminando(false);
    }
  }

  function abrirFormulario(servicio) {
    setMensajeOk('');
    setMensajeError('');
    setConfirmandoId(null);
    setFormulario({ servicio });
  }

  if (formulario) {
    return (
      <ServicioFormulario
        servicio={formulario.servicio}
        alGuardar={alGuardar}
        alCancelar={() => setFormulario(null)}
      />
    );
  }

  const texto = busqueda.trim().toLowerCase();
  const visibles = (servicios ?? []).filter(
    (servicio) => texto === '' || servicio.nombre.toLowerCase().includes(texto),
  );

  return (
    <main className="materiales">
      <div className="materiales-encabezado">
        <h1>Servicios</h1>
        <button type="button" onClick={() => abrirFormulario(null)}>
          Nuevo servicio
        </button>
      </div>

      {mensajeOk && <p className="mensaje mensaje-ok" role="status">{mensajeOk}</p>}
      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}

      {errorCarga && (
        <p className="mensaje mensaje-error" role="alert">
          {errorCarga}{' '}
          <button type="button" className="enlace" onClick={recargar}>
            Reintentar
          </button>
        </p>
      )}

      {servicios === null && !errorCarga && <p>Cargando servicios…</p>}

      {servicios !== null && (
        <>
          <div className="materiales-filtros">
            <input
              type="search"
              placeholder="Buscar por nombre"
              aria-label="Buscar por nombre"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>

          {servicios.length === 0 ? (
            <p>Todavía no hay servicios cargados. Usá "Nuevo servicio" para agregar el primero.</p>
          ) : visibles.length === 0 ? (
            <p>No hay servicios que coincidan con la búsqueda.</p>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla-materiales">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th className="numero">Duración</th>
                    <th className="numero">Precio base</th>
                    <th>Esteticistas habilitadas</th>
                    <th>Materiales</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((servicio) => (
                    <tr key={servicio.id}>
                      <td>{servicio.nombre}</td>
                      <td className="numero">{servicio.tiempoEstimado} min</td>
                      <td className="numero">{formatoPrecio.format(servicio.precioBase)}</td>
                      <td>{nombresDe(servicio.esteticistasHabilitadas, 'nombreCompleto')}</td>
                      <td>{nombresDe(servicio.materiales, 'nombre')}</td>
                      <td className="acciones">
                        {confirmandoId === servicio.id ? (
                          <>
                            <span>¿Eliminar?</span>
                            <button
                              type="button"
                              className="peligro"
                              onClick={() => alEliminar(servicio)}
                              disabled={eliminando}
                            >
                              {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
                            </button>
                            <button
                              type="button"
                              className="secundario"
                              onClick={() => setConfirmandoId(null)}
                              disabled={eliminando}
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <>
                            <button type="button" className="secundario" onClick={() => abrirFormulario(servicio)}>
                              Modificar
                            </button>
                            <button
                              type="button"
                              className="peligro-suave"
                              onClick={() => {
                                setMensajeOk('');
                                setMensajeError('');
                                setConfirmandoId(servicio.id);
                              }}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
