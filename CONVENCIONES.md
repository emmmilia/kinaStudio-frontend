# Convenciones del proyecto (front-end)

Reglas para trabajar en el repositorio del front-end de Kina Studio. Son las mismas del back-end en cuanto a ramas, commits y Pull Requests, más reglas propias de React.

## Ramas

- `main` está protegida: no se sube código directo, solo por Pull Request.
- Cada tarea va en una rama propia, creada desde `main` actualizada.
- Formato: `tipo/rfXX-descripcion-corta`, en minúsculas y con guiones.

| Tipo | Uso | Ejemplo |
|---|---|---|
| `feature/` | Funcionalidad nueva | `feature/rf01-registro-esteticista` |
| `fix/` | Corrección de un error | `fix/rf01-validacion-mail` |
| `docs/` | Documentación | `docs/readme-actualizado` |
| `chore/` | Configuración, dependencias, CI | `chore/actualiza-dependencias` |

## Commits

- Formato: `RF.XX: descripción en presente` (o `Docs:`, `Chore:`, `Fix:` si no corresponde a un requerimiento).
- Un commit por cambio con sentido propio; mensajes cortos y concretos.

```
RF.01: agrega formulario de registro de esteticista
Fix: muestra el mensaje de error que devuelve la API
Chore: actualiza dependencias de Vite
```

## Pull Requests

1. Antes de abrir el PR, correr `npm run lint` y `npm run build`: los dos sin errores.
2. El PR describe qué cambia y qué requerimiento cubre. Si cambia la interfaz, se adjunta una captura.
3. Tiene que pasar el check **Lint y build**.
4. Lo aprueba **la otra integrante** (nadie aprueba su propio PR). Aprobar no mergea.
5. Se mergea con **Squash and merge** y se borra la rama.

## Código

- Componentes: funciones de React en `PascalCase`, un componente por archivo, con el mismo nombre que el archivo (`FormularioEsteticista.tsx`).
- Funciones, variables y hooks en `camelCase`; los hooks propios empiezan con `use` (`useUsuarios`).
- Todo con TypeScript: sin `any`. Los datos que vienen de la API se describen con tipos en `src/types/`.
- Las llamadas al back-end se hacen **solo** desde `src/api/`. Los componentes y páginas usan esas funciones, no hacen `fetch` directo.
- La URL de la API sale de `import.meta.env.VITE_API_URL`; nunca se escribe a mano en el código.
- Los componentes se mantienen chicos: si uno hace demasiado, se divide.
- Se borran los `console.log` y el código comentado antes del PR.
- Texto de la interfaz en español.

## Seguridad

- **Nunca** se sube el archivo `.env` ni se escriben claves o tokens en el código.
- No se guardan contraseñas ni datos sensibles en `localStorage`.
- Todo lo que empieza con `VITE_` queda visible en el navegador: no va ahí nada secreto.
- La validación que importa (permisos, datos válidos) la hace el back-end. El front valida solo para dar mejor experiencia al usuario.

## Definición de terminado

Una tarea está terminada cuando:

- [ ] Cumple el requerimiento y funciona contra el back-end real.
- [ ] `npm run lint` y `npm run build` terminan sin errores.
- [ ] El check **Lint y build** está en verde.
- [ ] El PR fue aprobado por la otra integrante y mergeado con *squash*.
- [ ] La tarea en Jira está actualizada, con las horas registradas.
