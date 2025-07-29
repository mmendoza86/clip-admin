import { useEffect, useState } from 'react';
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from '../services/clienteService';
import { set } from 'date-fns';
import { Delete, DeleteIcon, Edit, Trash, Trash2 } from 'lucide-react';

interface Cliente {
  id: number;
  nombre: string;
  numero: string;
  correo: string;
  password: string;
  apiKey: string;
  claveSecreta: string;
}

export default function ClientesSection() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Cliente, 'id'>>({
    nombre: '',
    numero: '',
    correo: '',
    password: '',
    apiKey: '',
    claveSecreta: ''
  });
  const [modoEditar, setModoEditar] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const res = await getClientes();
      setClientes(res.data);
    } catch (err) {
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const guardarCliente = async () => {
    try {
      if (modoEditar !== null) {
        await updateCliente(modoEditar, nuevo);
      } else {
        await createCliente(nuevo);
      }

      setNuevo({
        nombre: '',
        numero: '',
        correo: '',
        password: '',
        apiKey: '',
        claveSecreta: ''
      });
      setModoEditar(null);
      cargarClientes();
    } catch (err) {
      alert('Error al guardar cliente');
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar cliente?')) return;
    try {
      await deleteCliente(id);
      cargarClientes();
    } catch {
      alert('Error al eliminar');
    }
  };

  const editar = (c: Cliente) => {
    setNuevo({
      nombre: c.nombre,
      numero: c.numero,
      correo: c.correo,
      password: c.password,
      apiKey: c.apiKey,
      claveSecreta: c.claveSecreta
    });
    setModoEditar(c.id);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Clientes</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input className="border px-2 py-1" placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <input className="border px-2 py-1" placeholder="No. Cliente" value={nuevo.numero} onChange={e => setNuevo({ ...nuevo, numero: e.target.value })} />
        <input className="border px-2 py-1" placeholder="Correo" value={nuevo.correo} onChange={e => setNuevo({ ...nuevo, correo: e.target.value })} />
        <input className="border px-2 py-1" placeholder="Password" value={nuevo.password} onChange={e => setNuevo({ ...nuevo, password: e.target.value })} />
        <input className="border px-2 py-1" placeholder="API Key" value={nuevo.apiKey} onChange={e => setNuevo({ ...nuevo, apiKey: e.target.value })} />
        <input className="border px-2 py-1" placeholder="Clave Secreta" value={nuevo.claveSecreta} onChange={e => setNuevo({ ...nuevo, claveSecreta: e.target.value })} />
        <button onClick={guardarCliente} className="col-span-3 bg-primary-700 text-white py-2 rounded hover:bg-primary-600">
          {modoEditar ? "Actualizar Cliente" : "Agregar Cliente"}
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full text-left border border-secondary-300 text-sm">
          <thead className="bg-secondary-300">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">No. Cliente</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Password</th>
              <th className="p-2">API Key</th>
              <th className="p-2">Clave Secreta</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.nombre}</td>
                <td className="p-2">{c.numero}</td>
                <td className="p-2">{c.correo}</td>
                <td className="p-2"><input type="password" readOnly value={c.password} className="bg-transparent" /></td>
                <td className="p-2"><input type="password" readOnly value={c.apiKey} className="bg-transparent" /></td>
                <td className="p-2"><input type="password" readOnly value={c.claveSecreta} className="bg-transparent" /></td>
                <td className="p-2 space-x-2">
                  <button onClick={() => editar(c)} className="text-blue-600 hover:underline">
                     <Edit className="inline w-4 h-4" />
                  </button>
                  <button onClick={() => eliminar(c.id)} className="text-red-600 hover:underline">
                    <Trash2 className="inline w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={7} className="p-2">
                {clientes.length === 0 ? 'No hay clientes' : null}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
