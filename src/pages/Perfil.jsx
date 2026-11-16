import { useEffect, useState } from 'react';
import { modificarPerfil, obtenerPerfil } from '../api/acceso';
import CambiarPassword from './CambiarPassword';
import './Perfil.css';

const DATOS_VACIOS = {
  email: '',
  nombreCompleto: '',
  comentario: '',
};

export default function Perfil({ nombreUsuario }) {
  const [datos, setDatos] = useState(DATOS_VACIOS);
  const [enviando, setEnviando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

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
      await modificarPerfil(datos);
      setMensajeOk('Tus datos se guardaron correctamente.');
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  useEffect(() => {
  obtenerPerfil()
    .then((u) => setDatos({
      email: u.email ?? '',
      nombreCompleto: u.nombreCompleto ?? '',
      comentario: u.comentario ?? '',
    }))
    .catch(() => setMensajeError('No se pudieron cargar tus datos.'));
}, []);

  return (
    <main className="perfil">
      <h1>Mi perfil</h1>

      <form onSubmit={alEnviar}>
        <label htmlFor="nombreUsuario">Nombre de usuario</label>
        <input id="nombreUsuario" type="text" value={nombreUsuario} disabled />

        <label htmlFor="nombreCompleto">Nombre completo</label>
        <input
          id="nombreCompleto"
          name="nombreCompleto"
          type="text"
          value={datos.nombreCompleto}
          onChange={alCambiar}
          maxLength={100}
          required
        />

        <label htmlFor="email">Mail</label>
        <input
          id="email"
          name="email"
          type="email"
          value={datos.email}
          onChange={alCambiar}
          maxLength={254}
          required
        />

        <label htmlFor="comentario">Comentario</label>
        <textarea
          id="comentario"
          name="comentario"
          value={datos.comentario}
          onChange={alCambiar}
          maxLength={500}
          rows={3}
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>

      {mensajeOk && <p className="mensaje mensaje-ok" role="status">{mensajeOk}</p>}
      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}

      <section className="seccion-password">
        <button
          type="button"
          className="boton-secundario"
          onClick={() => setMostrarPassword((visible) => !visible)}
        >
          {mostrarPassword ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}
        </button>

        {mostrarPassword && <CambiarPassword />}
      </section>
    </main>
  );
}

