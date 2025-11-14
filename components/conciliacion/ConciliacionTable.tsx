import { useState, useMemo } from 'react';
import { ConciliacionDetalle } from '../types/exportTypes';
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { FiInfo } from 'react-icons/fi'; 

interface Props {
  data: ConciliacionDetalle[];
  itemsPerPage?: number;
}

export default function ConciliacionTable({ data, itemsPerPage = 10 }: Props) {
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroTransaccion, setFiltroTransaccion] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');

    // Filtrar los datos primero
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchTransaccion = filtroTransaccion === '' || item.transactionId.toLowerCase().includes(filtroTransaccion.toLowerCase());
      const matchCuenta = filtroCuenta === '' || item.nombre_De_La_Cuenta.toLowerCase().includes(filtroCuenta.toLowerCase());
      return matchTransaccion && matchCuenta;
    });
  }, [data, filtroTransaccion, filtroCuenta]);


  // Calcular el total de páginas basado en los datos filtrados
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const exportarReporte = async () => {
    const datosFiltrados = data.filter(item => {
      const matchTransaccion = filtroTransaccion === '' || item.transactionId.includes(filtroTransaccion);
      const matchCuenta = filtroCuenta === '' || item.nombre_De_La_Cuenta.includes(filtroCuenta);
      return matchTransaccion && matchCuenta;
    });

    await axios.post('/api/reportes/generar', {
      data: datosFiltrados,
      seccion: 'conciliacion',
    });

    showToast({ title: 'Reporte generado', description: 'Puedes descargarlo en el historial.' });
  };

  return (
    <div className="overflow-auto">
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Filtrar por Transacción"
          value={filtroTransaccion}
          onChange={
            (e) => {
              setFiltroTransaccion(e.target.value);
              setCurrentPage(1);
            }
          }
          className="px-3 py-1 border rounded"
        />
        <input
          type="text"
          placeholder="Filtrar por Cuenta"
          value={filtroCuenta}
          onChange={
            (e) => {
              setFiltroCuenta(e.target.value);
              setCurrentPage(1);
            }
          }
          className="px-3 py-1 border rounded"
        />

          <button
            onClick={() => {
              setFiltroTransaccion('');
              setFiltroCuenta('');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Limpiar filtros
          </button>
        
        {data && (
          <div className="flex items-center space-x-2">
            <button
              onClick={exportarReporte}
              className="bg-secondary-500 text-white px-4 py-2 rounded hover:bg-secondary-600"
              title="El reporte incluirá solo los datos filtrados, si no se filtra, se exporta todo el reporte"
            >
              Exportar resultados
            </button>
            <div className="relative">
              <FiInfo 
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                title="El reporte incluirá solo los datos filtrados, si no se filtra, se exporta todo el reporte"
                size={16} 
              />
            </div>
          </div>
        )}
      </div>

      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-secondary-300 text-white">
          <tr>
            <th className="p-2 border">Transacción</th>
            <th className="p-2 border">Fecha Transacción</th>
            <th className="p-2 border">Fecha Depósito</th>
            <th className="p-2 border">Monto</th>
            <th className="p-2 border">Propina</th>
            <th className="p-2 border">MSI</th>
            <th className="p-2 border">Plazo</th>
            <th className="p-2 border">% Comisión</th>
            <th className="p-2 border">Comisión (MXN)</th>
            <th className="p-2 border">IVA</th>
            <th className="p-2 border">Retención</th>
            <th className="p-2 border">Monto Neto</th>
            <th className="p-2 border">Cuenta</th>
            <th className="p-2 border">Usuario Transacción</th>
            <th className="p-2 border">Usuario Depósito</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-100">
              <td className="p-2 border">{item.transactionId}</td>
              <td className="p-2 border">{item.fechaTransaccion.slice(0, 10)}</td>
              <td className="p-2 border">{item.fechaDeposito.slice(0, 10)}</td>
              <td className="p-2 border">${item.monto.toFixed(2)}</td>
              <td className="p-2 border">${item.propina.toFixed(2)}</td>
              <td className="p-2 border">{item.msi ?? 'N/A'}</td>
              <td className="p-2 border">{item.plazo}</td>
              <td className="p-2 border">{item.porcentaje_De_Comision.toFixed(2)}%</td>
              <td className="p-2 border">${item.comision_En_Pesos.toFixed(2)}</td>
              <td className="p-2 border">${item.iva.toFixed(2)}</td>
              <td className="p-2 border">${item.retencion_Total.toFixed(2)}</td>
              <td className="p-2 border font-bold">${item.monto_Neto.toFixed(2)}</td>
              <td className="p-2 border">{item.nombre_De_La_Cuenta}</td>
              <td className="p-2 border">{item.usuarioTransaccion}</td>
              <td className="p-2 border">{item.usuarioDeposito}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginador */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-3 py-1 bg-secondary-300 text-sm rounded hover:bg-secondary-400 disabled:opacity-50"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-4 py-1">{currentPage} / {totalPages}</span>
        <button
          className="px-3 py-1 bg-secondary-300 text-sm rounded hover:bg-secondary-400 disabled:opacity-50"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
