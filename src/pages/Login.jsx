import { useState } from 'react';
import { iniciarSesion, obtenerSesion } from '../api/acceso';
import './Login.css';

export default function Login({ alIniciarSesion }) {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  async function alEnviar(evento) {
    evento.preventDefault();
    setMensajeError('');
    setEnviando(true);

    try {
      await iniciarSesion(nombreUsuario, password);
      const sesion = await obtenerSesion();
      if (!sesion) {
        throw new Error('No se pudo iniciar la sesión.');
      }
      
      alIniciarSesion(sesion);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <h1>Kina Studio</h1>
      <h2>Iniciar sesión</h2>

      <form onSubmit={alEnviar}>
        <label htmlFor="nombreUsuario">Usuario</label>
        <input
          id="nombreUsuario"
          type="text"
          value={nombreUsuario}
          onChange={(evento) => setNombreUsuario(evento.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(evento) => setPassword(evento.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}
    </main>
  );
}