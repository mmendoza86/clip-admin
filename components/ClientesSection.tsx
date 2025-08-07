import { useEffect, useRef, useState } from 'react';
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from '../services/clienteService';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import ModalConfirm from './utils/ModalConfirm';

interface Cliente {
  id: number;
  nombre: string;
  numeroCte: string;
  correo: string;
  password: string;
  apiKey: string;
  claveSecreta: string;
}

export default function ClientesSection() {
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Cliente, 'id'>>({
    nombre: '',
    numeroCte: '',
    correo: '',
    password: '',
    apiKey: '',
    claveSecreta: ''
  });
  const [modoEditar, setModoEditar] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(clientes.length / itemsPerPage);
  const paginatedClientes = clientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    if (!modoEditar 
      && (!nuevo.nombre || !nuevo.numeroCte || !nuevo.correo || !nuevo.password || !nuevo.apiKey || !nuevo.claveSecreta)) {
      showToast({ title: 'Error al guardar', description: 'Por favor completa todos los campos.' });
      return;
    } else if (modoEditar && (!nuevo.nombre || !nuevo.numeroCte || !nuevo.correo)) {
      showToast({ title: 'Error al guardar', description: 'Por favor completa el nombre del cliente.' });
      return;
    }
    if (!nuevo.correo.includes('@')) {
      showToast({ title: 'Error al guardar', description: 'El correo electrónico no es válido.' });
      return;
    }

    try {
      if (modoEditar !== null) {
        await updateCliente(modoEditar, nuevo);
      } else {
        await createCliente(nuevo);
      }

      setNuevo({ nombre: '', numeroCte: '', correo: '', password: '', apiKey: '', claveSecreta: '' });
      setModoEditar(null);
      showToast({ title: 'Éxito', description: 'Cliente guardado correctamente.' });
      cargarClientes();
    } catch (err) {
      showToast({ title: 'Error', description: 'No se pudo guardar el cliente.' });
    }
  };

  const eliminar = async (id: number) => {
    try {
      await deleteCliente(id);
      showToast({ title: 'Éxito', description: 'Cliente eliminado correctamente.' });
      cargarClientes();
      setShowDeleteModal(false);
    } catch {
      showToast({ title: 'Error', description: 'No se pudo eliminar el cliente.' });
    }
  };

  const editar = (c: Cliente) => {
  setNuevo({
    nombre: c.nombre,
    numeroCte: c.numeroCte,
    correo: c.correo,
    password: c.password,
    apiKey: c.apiKey,
    claveSecreta: c.claveSecreta
  });
  setModoEditar(c.id);

  // Scroll al formulario
  formRef.current?.scrollIntoView({ behavior: "smooth" });
};

  const abrirModalEliminar = (id: number) => {
    setClienteToDelete(id);
    setShowDeleteModal(true);
  };

  const cerrarModalEliminar = () => {
    setShowDeleteModal(false);
    setClienteToDelete(null);
  };

  return (
    <div>
      <h2 ref={formRef} className="text-2xl font-bold mb-4">Gestión de Clientes</h2>

      <ModalConfirm
        isOpen={showDeleteModal}
        title="¿Estás seguro de eliminar este cliente?"
        message="Esta acción no se puede deshacer."
        onConfirm={() => clienteToDelete !== null && eliminar(clienteToDelete)}
        onCancel={cerrarModalEliminar}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input className="border px-2 py-1" placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <input className="border px-2 py-1" placeholder="No. Cliente" value={nuevo.numeroCte} onChange={e => setNuevo({ ...nuevo, numeroCte: e.target.value })} />
        <input className="border px-2 py-1" placeholder="Correo" value={nuevo.correo} onChange={e => setNuevo({ ...nuevo, correo: e.target.value })} />
        <input className="border px-2 py-1" placeholder="Password" value={nuevo.password} onChange={e => setNuevo({ ...nuevo, password: e.target.value })} />
        <input className="border px-2 py-1" placeholder="API Key" value={nuevo.apiKey} onChange={e => setNuevo({ ...nuevo, apiKey: e.target.value })} />
        <input className="border px-2 py-1" placeholder="Clave Secreta" value={nuevo.claveSecreta} onChange={e => setNuevo({ ...nuevo, claveSecreta: e.target.value })} />

        <div className={`col-span-1 md:col-span-3 ${modoEditar ? "flex gap-2" : ""}`}>
          <button onClick={guardarCliente} className="w-full bg-primary-700 text-white py-2 rounded hover:bg-primary-600">
            {modoEditar ? "Actualizar Cliente" : "Agregar Cliente"}
          </button>
          {modoEditar && (
            <button onClick={() => setModoEditar(null)} className="w-full bg-secondary-300 text-gray-700 py-2 rounded hover:bg-secondary-200">
              Cancelar Edición
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="block md:hidden">
            {paginatedClientes.map(c => (
              <div key={c.id} className="border rounded p-4 mb-2 shadow-sm text-sm">
                <p><strong>Nombre:</strong> {c.nombre}</p>
                <p><strong>No. Cliente:</strong> {c.numeroCte}</p>
                <p><strong>Correo:</strong> {c.correo}</p>
                <p><strong>Password:</strong> ******</p>
                <p><strong>API Key:</strong> ******</p>
                <p><strong>Clave Secreta:</strong> ******</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => editar(c)} className="text-blue-600 hover:underline">
                    <Edit className="inline w-4 h-4" />
                  </button>
                  <button onClick={() => abrirModalEliminar(c.id)} className="text-red-600 hover:underline">
                    <Trash2 className="inline w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left border border-secondary-300 text-sm">
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
                {paginatedClientes.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{c.nombre}</td>
                    <td className="p-2">{c.numeroCte}</td>
                    <td className="p-2">{c.correo}</td>
                    <td className="p-2"><input type="password" readOnly value="123123" className="bg-transparent" /></td>
                    <td className="p-2"><input type="password" readOnly value="123123" className="bg-transparent" /></td>
                    <td className="p-2"><input type="password" readOnly value="123123" className="bg-transparent" /></td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => editar(c)} className="text-blue-600 hover:underline">
                        <Edit className="inline w-4 h-4" />
                      </button>
                      <button onClick={() => abrirModalEliminar(c.id)} className="text-red-600 hover:underline">
                        <Trash2 className="inline w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {clientes.length > itemsPerPage && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-secondary-300 text-sm rounded hover:bg-secondary-400 disabled:opacity-50">
            Anterior
          </button>
          <span className="text-sm">Página {currentPage} de {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-secondary-300 text-sm rounded hover:bg-secondary-400 disabled:opacity-50">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
