import { useState } from 'react';

const DATOS_VACIOS = {
  nombreCompleto: '',
  email: '',
  telefono: '',
  notas: '',
};

export default function FormularioCliente({ titulo, datosIniciales, textoBoton, textoEnviando, alGuardar, alVolver }) {
  const [datos, setDatos] = useState({ ...DATOS_VACIOS, ...datosIniciales });
  const [enviando, setEnviando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  function alCambiar(evento) {
    const { name, value } = evento.target;
    setDatos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    setMensajeOk('');
    setMensajeError('');
    setEnviando(true);

    try {
      const mensaje = await alGuardar(datos);
      setMensajeOk(mensaje);
      if (!datosIniciales) setDatos(DATOS_VACIOS);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="clientes formulario-cliente">
      <button type="button" className="enlace" onClick={alVolver}>
        ← Volver a la lista
      </button>

      <h1>{titulo}</h1>

      <form onSubmit={alEnviar}>
        <label htmlFor="nombreCompleto">Nombre completo</label>
        <input
          id="nombreCompleto"
          name="nombreCompleto"
          type="text"
          value={datos.nombreCompleto}
          onChange={alCambiar}
          required
        />

        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={datos.telefono}
          onChange={alCambiar}
          required
        />

        <label htmlFor="email">Mail</label>
        <input
          id="email"
          name="email"
          type="email"
          value={datos.email}
          onChange={alCambiar}
        />

        <label htmlFor="notas">Notas</label>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          maxLength={1000}
          value={datos.notas}
          onChange={alCambiar}
        />

        <button type="submit" className="boton-principal" disabled={enviando}>
          {enviando ? textoEnviando : textoBoton}
        </button>
      </form>

      {mensajeOk && <p className="mensaje mensaje-ok" role="status">{mensajeOk}</p>}
      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}
    </main>
  );
}
