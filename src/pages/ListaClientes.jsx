import { useEffect, useState } from 'react';
import { eliminarCliente, listarClientes } from '../api/clientes';

export default function ListaClientes({ alRegistrar, alModificar }) {
  const [clientes, setClientes] = useState([]);
  const [mensajeOk, setMensajeOk] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Pide la lista al back; se usa al abrir la pantalla y después de eliminar un cliente
  function cargarClientes() {
    listarClientes()
      .then((lista) => setClientes(lista ?? []))
      .catch((error) => setMensajeError(error.message));
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  async function alEliminar(cliente) {
    const confirmado = window.confirm(
      `¿Estás segura de que querés eliminar a "${cliente.nombreCompleto}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmado) return;

    setMensajeOk('');
    setMensajeError('');
    try {
      await eliminarCliente(cliente.id);
      setMensajeOk(`Cliente "${cliente.nombreCompleto}" eliminado.`);
      cargarClientes();
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  }

  return (
    <main className="clientes">
      <div className="clientes-encabezado">
        <h1>Clientes</h1>
        <button type="button" className="boton-principal" onClick={alRegistrar}>
          Registrar cliente nuevo
        </button>
      </div>

      {mensajeOk && <p className="mensaje mensaje-ok" role="status">{mensajeOk}</p>}
      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}

      {clientes.length === 0 && !mensajeError && <p>Todavía no hay clientes.</p>}

      {clientes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Mail</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nombreCompleto}</td>
                <td>{c.telefono}</td>
                <td>{c.email}</td>
                <td className="acciones">
                  <button type="button" className="boton-secundario" onClick={() => alModificar(c)}>
                    Modificar
                  </button>
                  <button type="button" className="boton-peligro" onClick={() => alEliminar(c)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
