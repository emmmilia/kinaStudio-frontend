import { useState } from 'react';
import ListaClientes from './ListaClientes';
import ModificarCliente from './ModificarCliente';
import RegistroCliente from './RegistroCliente';
import './Clientes.css';

// Pantalla de clientes: decide cuál de las tres sub-pantallas se muestra
export default function Clientes() {
  // 'lista', 'registrar' o 'modificar'
  const [vista, setVista] = useState('lista');
  // Cliente elegido para modificar
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  function volverALaLista() {
    setClienteSeleccionado(null);
    setVista('lista');
  }

  function irAModificar(cliente) {
    setClienteSeleccionado(cliente);
    setVista('modificar');
  }

  if (vista === 'registrar') {
    return <RegistroCliente alVolver={volverALaLista} />;
  }

  if (vista === 'modificar' && clienteSeleccionado) {
    return <ModificarCliente cliente={clienteSeleccionado} alVolver={volverALaLista} />;
  }

  return <ListaClientes alRegistrar={() => setVista('registrar')} alModificar={irAModificar} />;
}
