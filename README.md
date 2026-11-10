# Kina Studio — Front-end

Interfaz web de Kina Studio, un sistema de gestión para un estudio de estética (agenda de turnos, clientas, pagos y señas, comisiones, stock y reportes).

Proyecto final de la carrera Analista Programador, Universidad ORT Uruguay.

Este repositorio contiene **solo el front-end**. El back-end (API REST) está en [kinaStudio-springboot](https://github.com/emmmilia/kinaStudio-springboot).

## Equipo

- Emilia García
- Alina Reyes

## Tecnologías

| Qué | Tecnología |
|---|---|
| Framework | React (JavaScript) |
| Empaquetador | Vite |
| Calidad de código | ESLint |
| Integración continua | GitHub Actions (lint y build en cada Pull Request) |
| Back-end | API REST en Java / Spring Boot (otro repositorio) |

## Cómo levantar el proyecto

### Requisitos

- Node.js 20.19 o superior (se recomienda la versión LTS)
- Git

### Pasos

```powershell
git clone https://github.com/emmmilia/kinaStudio-frontend.git
cd kinaStudio-frontend
npm install
Copy-Item .env.example .env
npm run dev
```

La aplicación queda en `http://localhost:5173`.

Para que muestre datos reales, el back-end tiene que estar levantado (ver el README del repositorio del back).

### Variables de entorno

Se definen en el archivo `.env`, que **no se sube al repositorio**. El archivo `.env.example` es la plantilla.

| Variable | Para qué sirve | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API del back-end | `http://localhost:8080` |

Vite solo expone al navegador las variables que empiezan con `VITE_`. Todo lo que se ponga ahí es visible para cualquiera que abra la aplicación, así que **nunca** se guardan claves ni tokens en estas variables.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run lint` | Revisa el código con ESLint |
| `npm run preview` | Sirve localmente el resultado de `build` |

Antes de abrir un Pull Request, correr `npm run lint` y `npm run build`: los dos tienen que terminar sin errores.

## Estructura

```
kinaStudio-frontend/
├── .github/workflows/   Integración continua
├── public/              Archivos estáticos
├── src/
│   ├── api/             Llamadas al back-end
│   ├── components/      Componentes reutilizables
│   ├── pages/           Una pantalla por página
│   ├── hooks/           Hooks propios
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── CONVENCIONES.md
└── package.json
```

## Conexión con el back-end

Todas las respuestas de la API tienen la misma forma: un objeto `commands` con una lista de comandos, cada uno con un `id` y un `parametro`.

```json
{ "commands": [ { "id": "nuevoUsuario", "parametro": { "...": "..." } } ] }
```

Las llamadas a la API se hacen solo desde `src/api/`, usando `VITE_API_URL` como base. Los componentes no hacen `fetch` directo.

Para que el navegador pueda llamar al back desde `localhost:5173`, el back-end tiene que habilitar CORS para ese origen (se configura junto con el login).

## Integración continua

El workflow `CI` corre en cada Pull Request y en cada push a `main`: instala dependencias, ejecuta `npm run lint` y `npm run build`. El check **Lint y build** es obligatorio para mergear.

## Cómo trabajamos

Las reglas de ramas, commits y Pull Requests están en [CONVENCIONES.md](CONVENCIONES.md).

## Estado

| Funcionalidad | Estado |
|---|---|
| Proyecto base con Vite y React | Listo |
| Registro de esteticistas (RF.01) | Pendiente |
| Login y sesión (RF.2) | Pendiente |
