'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileSpreadsheet } from 'lucide-react'; // Icono Excel

const secciones = ['depositos', 'transacciones', 'conciliacion'];

export default function HistorialSection() {
  const [reportes, setReportes] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodosReportes = async () => {
      const resultado: Record<string, string[]> = {};
      try {
        await Promise.all(
          secciones.map(async (seccion) => {
            try {
              const res = await axios.get('/api/reportes/historial', {
                params: { seccion },
              });
              resultado[seccion] = res.data.files || [];
            } catch (e) {
              resultado[seccion] = [];
            }
          })
        );
        setReportes(resultado);
      } catch (err) {
        console.error('Error al cargar historial:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodosReportes();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Historial de Reportes</h2>

      {loading ? (
        <p className="text-gray-500">Cargando historial...</p>
      ) : (
        secciones.map((seccion) => (
          <div key={seccion} className="bg-white rounded-xl p-4 border shadow">
            <h3 className="text-lg font-semibold capitalize mb-4">{seccion}</h3>

            {reportes[seccion]?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border-b">Nombre</th>
                      <th className="px-4 py-2 border-b">Fecha</th>
                      <th className="px-4 py-2 border-b text-center">Descargar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportes[seccion].map((file, idx) => {
                     const match = file.match(/(\d{13})/);
                     const fecha = match ? new Date(parseInt(match[1], 10)) : null;

                      const fechaFormateada = fecha
                        ? `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')} ${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}:${String(fecha.getSeconds()).padStart(2, '0')}`
                        : "N/A";



                      return (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{file}</td>
                          <td className="px-4 py-2">{fechaFormateada}</td>
                          <td className="px-4 py-2 text-center">
                            <a
                              href={`/reportes/${seccion}/${file}`}
                              download
                              className="text-green-600 hover:text-green-800"
                              title="Descargar Excel"
                            >
                              <FileSpreadsheet className="w-5 h-5 inline" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay reportes generados.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
