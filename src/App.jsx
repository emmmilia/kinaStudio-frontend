import { useEffect, useState } from 'react';
import { cerrarSesion, obtenerSesion } from './api/acceso';
import Clientes from './pages/Clientes';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Materiales from './pages/Materiales';
import RecuperarPassword from './pages/RecuperarPassword';
import RegistroEsteticista from './pages/RegistroEsteticista';
import RestablecerPassword from './pages/RestablecerPassword';
import Servicios from './pages/Servicios';
import './App.css';

/** Lee el token del enlace del mail (?token=...). Vacío si no hay */
function leerTokenDeLaUrl() {
  return new URLSearchParams(window.location.search).get('token') ?? '';
}

export default function App() {
  // undefined = todavía consultando al back, null = sin sesión, objeto = usuario con sesión
  const [sesion, setSesion] = useState(undefined);
  // Pantalla que se está mostrando: 'inicio', 'perfil' o 'clientes'
  const [pantalla, setPantalla] = useState('inicio');
  // Pantalla sin sesión: 'login' o 'recuperar'
  const [pantallaPublica, setPantallaPublica] = useState('login');
  // Token del enlace de recuperación de contraseña, si el usuario llegó desde el mail
  const [tokenRecuperacion, setTokenRecuperacion] = useState(leerTokenDeLaUrl);

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

  //el token se saca de la barra de direcciones para que no quede en el historial del navegador
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  async function alCerrarSesion() {
    try {
      await cerrarSesion();
    } catch {
      //aunque falle el aviso al back se vuelve a la pantalla de login
    }
    setPantalla('inicio');
    setSesion(null);
  }

  function terminarRecuperacion() {
    setTokenRecuperacion('');
    setPantallaPublica('login');
  }

  if (sesion === undefined) {
    return <p className="cargando">Cargando…</p>;
  }

  if (sesion === null) {
    if (tokenRecuperacion) {
      return <RestablecerPassword token={tokenRecuperacion} alTerminar={terminarRecuperacion} />;
    }
    if (pantallaPublica === 'recuperar') {
      return <RecuperarPassword alVolver={() => setPantallaPublica('login')} />;
    }
    return (
      <Login
        alIniciarSesion={setSesion}
        alOlvidarPassword={() => setPantallaPublica('recuperar')}
      />
    );
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
          <button type="button" onClick={() => setPantalla('clientes')}>
            Clientes
          </button>
          <button type="button" onClick={() => setPantalla('materiales')}>
            Materiales
          </button>
          <button type="button" onClick={() => setPantalla('servicios')}>
            Servicios
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

      {pantalla === 'materiales' && sesion.rol === 'ADMINISTRADOR' && <Materiales />}

      {pantalla === 'servicios' && sesion.rol === 'ADMINISTRADOR' && <Servicios />}

      {pantalla === 'clientes' && sesion.rol === 'ADMINISTRADOR' &&<Clientes />}

      {pantalla === 'inicio' && sesion.rol === 'ADMINISTRADOR' && <RegistroEsteticista />}

      {pantalla === 'inicio' && sesion.rol !== 'ADMINISTRADOR' && (
        <main className="contenido">
          <p>Todavía no hay pantallas disponibles para tu rol.</p>
        </main>
      )}
    </>
  );
}