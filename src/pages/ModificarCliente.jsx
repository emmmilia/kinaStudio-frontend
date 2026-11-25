import { modificarCliente } from '../api/clientes';
import FormularioCliente from './FormularioCliente';

export default function ModificarCliente({ cliente, alVolver }) {
  // Los campos vacíos del back llegan como null; el formulario necesita textos
  const datosIniciales = {
    nombreCompleto: cliente.nombreCompleto ?? '',
    email: cliente.email ?? '',
    telefono: cliente.telefono ?? '',
    notas: cliente.notas ?? '',
  };

  async function alGuardar(datos) {
    await modificarCliente(cliente.id, datos);
    return 'Los datos del cliente se guardaron correctamente.';
  }

  return (
    <FormularioCliente
      titulo="Modificar cliente"
      datosIniciales={datosIniciales}
      textoBoton="Guardar cambios"
      textoEnviando="Guardando…"
      alGuardar={alGuardar}
      alVolver={alVolver}
    />
  );
}
