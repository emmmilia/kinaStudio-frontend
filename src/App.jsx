import { useEffect, useState } from 'react';
import { cerrarSesion, obtenerSesion } from './api/acceso';
import Login from './pages/Login';
import RegistroEsteticista from './pages/RegistroEsteticista';
import './App.css';

export default function App() {
  // undefined = todavía consultando al back, null = sin sesión, objeto = usuario con sesión
  const [sesion, setSesion] = useState(undefined);

  //al abrir o recargar la página se pregunta si ya hay una sesión iniciada
  useEffect(() => {
    let activo = true;
    obtenerSesion()
      .then((datos) => {
        if (activo) setSesion(datos);
      })
      .catch(() => {
        if (activo) setSesion(null);
      });
    return () => {
      activo = false;
    };
  }, []);

  async function alCerrarSesion() {
    try {
      await cerrarSesion();
    } catch {
      //aunque falle el aviso al back se vuelve a la pantalla de login
    }
    setSesion(null);
  }

  if (sesion === undefined) {
    return <p className="cargando">Cargando…</p>;
  }

  if (sesion === null) {
    return <Login alIniciarSesion={setSesion} />;
  }

  return (
    <>
      <header className="barra-sesion">
        <span>
          {sesion.nombreUsuario} ({sesion.rol.toLowerCase()})
        </span>
        <button type="button" onClick={alCerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      {sesion.rol === 'ADMINISTRADOR' ? (
        <RegistroEsteticista />
      ) : (
        <main className="contenido">
          <p>Todavía no hay pantallas disponibles para tu rol.</p>
        </main>
      )}
    </>
  );
}
