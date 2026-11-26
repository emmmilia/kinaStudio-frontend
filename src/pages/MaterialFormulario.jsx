import { useState } from 'react';
import { CATEGORIAS, crearMaterial, modificarMaterial } from '../api/material';
import './Materiales.css';

//convierte un material del back en los textos que se muestran en los campos
function camposIniciales(material) {
  if (!material) {
    return { nombre: '', marca: '', categoria: '', stock: '0', precioUnitario: '', umbralMinimo: '0' };
  }
  return {
    nombre: material.nombre,
    marca: material.marca,
    categoria: material.categoria,
    stock: String(material.stock),
    precioUnitario: String(material.precioUnitario),
    umbralMinimo: String(material.umbralMinimo),
  };
}

function validar(campos) {
  if (campos.nombre.trim() === '') return 'El nombre es obligatorio.';
  if (campos.marca.trim() === '') return 'La marca es obligatoria.';
  return '';
}

/**
 * Formulario para crear un material (material = null) o modificar uno existente.
 * alGuardar recibe el mensaje de éxito; alCancelar vuelve a la lista sin guardar.
 */
export default function MaterialFormulario({ material, alGuardar, alCancelar }) {
  const [campos, setCampos] = useState(() => camposIniciales(material));
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  function alCambiar(evento) {
    const { name, value } = evento.target;
    setCampos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    setMensajeError('');

    const error = validar(campos);
    if (error) {
      setMensajeError(error);
      return;
    }

    const datos = {
      nombre: campos.nombre.trim(),
      marca: campos.marca.trim(),
      categoria: campos.categoria,
      stock: campos.stock,
      precioUnitario: campos.precioUnitario,
      umbralMinimo: campos.umbralMinimo,
    };

    setEnviando(true);
    try {
      if (material) {
        await modificarMaterial(material.id, datos);
        alGuardar('Material modificado correctamente.');
      } else {
        await crearMaterial(datos);
        alGuardar('Material creado correctamente.');
      }
    } catch (errorDelBack) {
      setMensajeError(errorDelBack instanceof Error ? errorDelBack.message : 'Ocurrió un error inesperado.');
      setEnviando(false);
    }
  }

  return (
    <main className="materiales materiales-formulario">
      <h1>{material ? 'Modificar material' : 'Nuevo material'}</h1>

      <form onSubmit={alEnviar} noValidate>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" type="text" maxLength={100} value={campos.nombre} onChange={alCambiar} required />

        <label htmlFor="marca">Marca</label>
        <input id="marca" name="marca" type="text" maxLength={100} value={campos.marca} onChange={alCambiar} required />

        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" name="categoria" value={campos.categoria} onChange={alCambiar} required>
          <option value="">Elegí una categoría</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria.valor} value={categoria.valor}>
              {categoria.texto}
            </option>
          ))}
        </select>

        <label htmlFor="stock">Stock</label>
        <input id="stock" name="stock" type="number" min="0" step="1" value={campos.stock} onChange={alCambiar} required />

        <label htmlFor="precioUnitario">Precio unitario</label>
        <input
          id="precioUnitario"
          name="precioUnitario"
          type="number"
          min="0"
          max="99999999.99"
          step="0.01"
          value={campos.precioUnitario}
          onChange={alCambiar}
          required
        />

        <label htmlFor="umbralMinimo">Umbral mínimo de stock</label>
        <input id="umbralMinimo" name="umbralMinimo" type="number" min="0" step="1" value={campos.umbralMinimo} onChange={alCambiar} required />
        <small>Cuando el stock llega a este número o menos, el material aparece como "Stock bajo".</small>

        <div className="botones-formulario">
          <button type="submit" disabled={enviando}>
            {enviando ? 'Guardando…' : 'Guardar'}
          </button>
          <button type="button" className="secundario" onClick={alCancelar} disabled={enviando}>
            Cancelar
          </button>
        </div>
      </form>

      {mensajeError && <p className="mensaje mensaje-error" role="alert">{mensajeError}</p>}
    </main>
  );
}