import { registrarCliente } from '../api/clientes';
import FormularioCliente from './FormularioCliente';

export default function RegistroCliente({ alVolver }) {
  async function alGuardar(datos) {
    await registrarCliente(datos);
    return `Cliente "${datos.nombreCompleto}" registrado correctamente.`;
  }

  return (
    <FormularioCliente
      titulo="Registrar cliente"
      textoBoton="Registrar"
      textoEnviando="Registrando…"
      alGuardar={alGuardar}
      alVolver={alVolver}
    />
  );
}
