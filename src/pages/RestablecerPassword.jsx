import { useState } from 'react';
import { restablecerPassword } from '../api/acceso';
import './Login.css';

export default function RestablecerPassword({ token, alTerminar }) {
  const [passwordNueva, setPasswordNueva] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  async function alEnviar(evento) {
    evento.preventDefault();
    setMensajeError('');

    if (passwordNueva !== repetirPassword) {
      setMensajeError('Las contraseñas no coinciden.');
      return;
    }

    setEnviando(true);
    try {
      await restablecerPassword(token, passwordNueva);
      setListo(true);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  if (listo) {
    return (
      <main className="login">
        <h1>Kina Studio</h1>
        <h2>Contraseña restablecida</h2>
        <p className="mensaje mensaje-ok" role="status">
          Tu contraseña se cambió correctamente. Ya podés iniciar sesión con la nueva.
        </p>
        <form onSubmit={(evento) => { evento.preventDefault(); alTerminar(); }}>
          <button type="submit">Ir a iniciar sesión</button>
        </form>
      </main>
    );
  }

  return (
    <main className="login">
      <h1>Kina Studio</h1>
      <h2>Elegí tu contraseña nueva</h2>

      <form onSubmit={alEnviar}>
        <label htmlFor="passwordNueva">Contraseña nueva</label>
        <input
          id="passwordNueva"
          type="password"
          value={passwordNueva}
          onChange={(evento) => setPasswordNueva(evento.target.value)}
          autoComplete="new-password"
          required
        />

        <label htmlFor="repetirPassword">Repetir contraseña nueva</label>
        <input
          id="repetirPassword"
          type="password"
          value={repetirPassword}
          onChange={(evento) => setRepetirPassword(evento.target.value)}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </form>

      <button type="button" className="enlace" onClick={alTerminar}>
        Volver a iniciar sesión
      </button>

      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}
    </main>
  );
}