import { useEffect, useState } from 'react';
import { eliminarMaterial, listarMateriales, CATEGORIAS, textoDeCategoria } from '../api/material';
import MaterialFormulario from './MaterialFormulario';
import './Materiales.css';

const formatoPrecio = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' });

/** Estado de stock de un material: sin stock, stock bajo o normal. */
function estadoDeStock(material) {
  if (material.stock === 0) return { clase: 'estado-sin', texto: 'Sin stock' };
  if (material.stock <= material.umbralMinimo) return { clase: 'estado-bajo', texto: 'Stock bajo' };
  return { clase: 'estado-ok', texto: 'Normal' };
}

function mensajeDe(error) {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

export default function Materiales() {
  // null = todavía cargando la lista
  const [materiales, setMateriales] = useState(null);
  const [errorCarga, setErrorCarga] = useState('');
  // null = se muestra la lista; { material: null } = alta; { material: {...} } = modificación
  const [formulario, setFormulario] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');

  //lista que se carga al abrir la pantalla
  useEffect(() => {
    let activo = true;
    listarMateriales()
      .then((lista) => {
        if (activo) setMateriales(lista);
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
      setMateriales(await listarMateriales());
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

  async function alEliminar(material) {
    setMensajeOk('');
    setMensajeError('');
    setEliminando(true);
    try {
      await eliminarMaterial(material.id);
      setConfirmandoId(null);
      setMensajeOk(`Material "${material.nombre}" eliminado.`);
      await recargar();
    } catch (error) {
      setMensajeError(mensajeDe(error));
    } finally {
      setEliminando(false);
    }
  }

  function abrirFormulario(material) {
    setMensajeOk('');
    setMensajeError('');
    setConfirmandoId(null);
    setFormulario({ material });
  }

  if (formulario) {
    return (
      <MaterialFormulario
        material={formulario.material}
        alGuardar={alGuardar}
        alCancelar={() => setFormulario(null)}
      />
    );
  }

  const texto = busqueda.trim().toLowerCase();
  const visibles = (materiales ?? []).filter(
    (material) =>
      (categoria === '' || material.categoria === categoria) &&
      (texto === '' ||
        material.nombre.toLowerCase().includes(texto) ||
        material.marca.toLowerCase().includes(texto)),
  );

  return (
    <main className="materiales">
      <div className="materiales-encabezado">
        <h1>Materiales</h1>
        <button type="button" onClick={() => abrirFormulario(null)}>
          Nuevo material
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

      {materiales === null && !errorCarga && <p>Cargando materiales…</p>}

      {materiales !== null && (
        <>
          <div className="materiales-filtros">
            <input
              type="search"
              placeholder="Buscar por nombre o marca"
              aria-label="Buscar por nombre o marca"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
            <select
              aria-label="Filtrar por categoría"
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value)}
            >
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map((item) => (
                <option key={item.valor} value={item.valor}>
                  {item.texto}
                </option>
              ))}
            </select>
          </div>

          {materiales.length === 0 ? (
            <p>Todavía no hay materiales cargados. Usá "Nuevo material" para agregar el primero.</p>
          ) : visibles.length === 0 ? (
            <p>No hay materiales que coincidan con la búsqueda.</p>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla-materiales">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Categoría</th>
                    <th className="numero">Stock</th>
                    <th className="numero">Precio unitario</th>
                    <th className="numero">Umbral mínimo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((material) => {
                    const estado = estadoDeStock(material);
                    return (
                      <tr key={material.id}>
                        <td>{material.nombre}</td>
                        <td>{material.marca}</td>
                        <td>{textoDeCategoria(material.categoria)}</td>
                        <td className="numero">{material.stock}</td>
                        <td className="numero">{formatoPrecio.format(material.precioUnitario)}</td>
                        <td className="numero">{material.umbralMinimo}</td>
                        <td>
                          <span className={`estado ${estado.clase}`}>{estado.texto}</span>
                        </td>
                        <td className="acciones">
                          {confirmandoId === material.id ? (
                            <>
                              <span>¿Eliminar?</span>
                              <button
                                type="button"
                                className="peligro"
                                onClick={() => alEliminar(material)}
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
                              <button type="button" className="secundario" onClick={() => abrirFormulario(material)}>
                                Modificar
                              </button>
                              <button
                                type="button"
                                className="peligro-suave"
                                onClick={() => {
                                  setMensajeOk('');
                                  setMensajeError('');
                                  setConfirmandoId(material.id);
                                }}
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}