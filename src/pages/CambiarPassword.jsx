import { useState } from 'react';
import { cambiarPassword } from '../api/acceso';
import './CambiarPassword.css';

const CAMPOS_VACIOS = {
  passwordActual: '',
  passwordNueva: '',
  repetirPassword: '',
};

export default function CambiarPassword() {
  const [campos, setCampos] = useState(CAMPOS_VACIOS);
  const [enviando, setEnviando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  function alCambiar(evento) {
    const { name, value } = evento.target;
    setCampos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    setMensajeOk('');
    setMensajeError('');

    if (campos.passwordNueva !== campos.repetirPassword) {
      setMensajeError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setEnviando(true);
    try {
      await cambiarPassword(campos.passwordActual, campos.passwordNueva);
      setMensajeOk('Contraseña actualizada correctamente.');
      setCampos(CAMPOS_VACIOS);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="cambio-password">
      <h1>Cambiar contraseña</h1>

      <form onSubmit={alEnviar}>
        <label htmlFor="passwordActual">Contraseña actual</label>
        <input
          id="passwordActual"
          name="passwordActual"
          type="password"
          value={campos.passwordActual}
          onChange={alCambiar}
          autoComplete="current-password"
          required
        />

        <label htmlFor="passwordNueva">Contraseña nueva</label>
        <input
          id="passwordNueva"
          name="passwordNueva"
          type="password"
          value={campos.passwordNueva}
          onChange={alCambiar}
          autoComplete="new-password"
          required
        />

        <label htmlFor="repetirPassword">Repetir contraseña nueva</label>
        <input
          id="repetirPassword"
          name="repetirPassword"
          type="password"
          value={campos.repetirPassword}
          onChange={alCambiar}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </form>

      {mensajeOk && <p className="mensaje mensaje-ok" role="status">{mensajeOk}</p>}
      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}
    </main>
  );
}
CambiarPassword.jsx