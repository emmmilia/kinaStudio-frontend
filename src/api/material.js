import { borrar, getJson, postFormulario, putFormulario } from './cliente';

//categorías que acepta el back (enum Categoria), por el momento lo dejamos así y después vemos
export const CATEGORIAS = [
  { valor: 'NAILS', texto: 'Nails' },
  { valor: 'LASHES', texto: 'Lashes' },
  { valor: 'CEJAS', texto: 'Cejas' },
  { valor: 'LIMPIEZA', texto: 'Limpieza' },
];

//devuelve el texto para mostrar de una categoría
export function textoDeCategoria(valor) {
  return CATEGORIAS.find((categoria) => categoria.valor === valor)?.texto ?? valor;
}

function aFormulario(material) {
  return {
    nombre: material.nombre,
    stock: material.stock,
    precioUnitario: material.precioUnitario,
    marca: material.marca,
    categoria: material.categoria,
    umbralMinimo: material.umbralMinimo,
  };
}

export async function listarMateriales() {
  const respuesta = await getJson('/studio/materiales');
  if (!respuesta) {
    throw new Error('Tu sesión expiró. Volvé a iniciar sesión.');
  }
  const comando = respuesta.commands?.find((item) => item.id === 'listarMateriales');
  return comando?.parametro ?? [];
}

export function crearMaterial(material) {
  return postFormulario('/studio/materiales/crear', aFormulario(material));
}

export function modificarMaterial(id, material) {
  return putFormulario(`/studio/materiales/${id}`, aFormulario(material));
}

export function eliminarMaterial(id) {
  return borrar(`/studio/materiales/${id}`);
}
