import { useEffect, useState } from 'react';
import { cerrarSesion, obtenerSesion } from './api/acceso';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import RegistroEsteticista from './pages/RegistroEsteticista';
import './App.css';

export default function App() {
  // undefined = todavía consultando al back, null = sin sesión, objeto = usuario con sesión
  const [sesion, setSesion] = useState(undefined);
  // Pantalla que se está mostrando: 'inicio' o 'perfil'
  const [pantalla, setPantalla] = useState('inicio');

  // Al abrir o recargar la página se pregunta si ya hay una sesión iniciada
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
      // Aunque falle el aviso al back, se vuelve a la pantalla de login
    }
    setPantalla('inicio');
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
        <nav className="navegacion">
          <button type="button" onClick={() => setPantalla('inicio')}>
            Inicio
          </button>
          <button type="button" onClick={() => setPantalla('perfil')}>
            Mi perfil
          </button>
        </nav>
        <div className="usuario">
          <span>
            {sesion.nombreUsuario} ({sesion.rol.toLowerCase()})
          </span>
          <button type="button" onClick={alCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {pantalla === 'perfil' && <Perfil nombreUsuario={sesion.nombreUsuario} />}

      {pantalla === 'inicio' && sesion.rol === 'ADMINISTRADOR' && <RegistroEsteticista />}

      {pantalla === 'inicio' && sesion.rol !== 'ADMINISTRADOR' && (
        <main className="contenido">
          <p>Todavía no hay pantallas disponibles para tu rol.</p>
        </main>
      )}
    </>
  );
}