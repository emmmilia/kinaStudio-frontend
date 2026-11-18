import { useState } from 'react';
import { recuperarPassword } from '../api/acceso';
import './Login.css';

export default function RecuperarPassword({ alVolver }) {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  async function alEnviar(evento) {
    evento.preventDefault();
    setMensajeOk('');
    setMensajeError('');
    setEnviando(true);

    try {
      await recuperarPassword(email);
      // El back responde lo mismo exista o no el mail, así que el mensaje no promete nada
      setMensajeOk('Si el mail está registrado, te enviamos un enlace para restablecer tu contraseña. Revisá tu casilla (y la carpeta de spam). El enlace vale 30 minutos.');
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <h1>Kina Studio</h1>
      <h2>Recuperar contraseña</h2>
      <p>Ingresá el mail de tu cuenta y te mandamos un enlace para elegir una contraseña nueva.</p>

      <form onSubmit={alEnviar}>
        <label htmlFor="email">Mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          autoComplete="email"
          required
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar enlace'}
        </button>
      </form>

      <button type="button" className="enlace" onClick={alVolver}>
        Volver a iniciar sesión
      </button>

      {mensajeOk && <p className="mensaje mensaje-ok" role="status">{mensajeOk}</p>}
      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}
    </main>
  );
}