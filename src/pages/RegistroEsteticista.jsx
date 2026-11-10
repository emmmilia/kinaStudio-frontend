import { useState } from 'react';
import { registrarEsteticista } from '../api/acceso';
import './RegistroEsteticista.css';

const DATOS_VACIOS = {
  email: '',
  nombreUsuario: '',
  password: '',
  nombreCompleto: '',
};

export default function RegistroEsteticista() {
  const [datos, setDatos] = useState(DATOS_VACIOS);
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
      await registrarEsteticista(datos);
      setMensajeOk(`Esteticista "${datos.nombreCompleto}" registrada correctamente.`);
      setDatos(DATOS_VACIOS);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="registro">
      <h1>Registrar esteticista</h1>

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

        <label htmlFor="email">Mail</label>
        <input
          id="email"
          name="email"
          type="email"
          value={datos.email}
          onChange={alCambiar}
          required
        />

        <label htmlFor="nombreUsuario">Nombre de usuario</label>
        <input
          id="nombreUsuario"
          name="nombreUsuario"
          type="text"
          value={datos.nombreUsuario}
          onChange={alCambiar}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={datos.password}
          onChange={alCambiar}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando…' : 'Registrar'}
        </button>
      </form>

      {mensajeOk && <p className="mensaje mensaje-ok" role="status">{mensajeOk}</p>}
      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}
    </main>
  );
}
