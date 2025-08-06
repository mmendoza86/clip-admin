import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import SelectConBuscador from '../utils/SelectSearch';
import DateCalendar from '../utils/DateCalendar';
import { getExportModel } from '../utils/ExportsModels';
import { getClientes } from '@/services/clienteService';
import { Loader } from 'lucide-react';

interface ClienteOption {
  id: number;
  label: string;
}

interface ReporteSeccionProps {
  seccion: 'depositos' | 'transacciones';
  fetchData: (from: Date | null, to: Date | null, clienteId: number | string) => Promise<any>;
}

export default function ReporteSeccion({ seccion, fetchData }: ReporteSeccionProps) {
  const { showToast } = useToast();
  const [clienteId, setClienteId] = useState<number | string>(0);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [ultimoReporte, setUltimoReporte] = useState<string | null>(null);
  const [newreport, setNewReport] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUltimoReporte = async () => {
      try {
        const res = await axios.get('/api/reportes/historial', {
          params: { seccion }
        });

        const archivos = res.data.files;
        if (archivos?.length > 0) {
          setUltimoReporte(archivos[0]);
        }
      } catch (err) {
        console.error(`Error al obtener último reporte de ${seccion}`, err);
      }
    };

    fetchUltimoReporte();
  }, [newreport, seccion]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await getClientes();
        const opciones = [
          { id: 0, label: 'Todos los clientes' },
          ...res.data.map((c: any) => ({
            id: c.id,
            label: `${c.nombre} - ${c.correo}`
          }))
        ];
        setClientes(opciones);
      } catch (err) {
        console.error('Error al obtener clientes', err);
        setClientes([{ id: 0, label: 'Todos los clientes' }]);
      }
    };

    fetchClientes();
  }, []);

  const generarReporte = async () => {
    if (!startDate || !endDate) {
      showToast({
        title: 'Fechas requeridas',
        description: 'Selecciona fecha de inicio y fin.'
      });
      return;
    }

    setLoading(true); // Activamos el loading antes de la llamada asíncrona

    try {
      const res = await fetchData(startDate, endDate, clienteId);
      const data = seccion === 'depositos' ? res.data.settlements : res.data;
      const transformer = getExportModel(seccion);
      const exportData = transformer(data);

      if (exportData.length === 0) {
        showToast({
          title: 'No hay datos',
          description: 'No se encontraron transacciones para el periodo seleccionado.'
        });
        setLoading(false); // Desactivamos el loading
        return;
      }

      const response = await axios.post('/api/reportes/generar', {
        data: exportData,
        clienteId,
        startDate,
        endDate,
        seccion
      });

      setNewReport(true);
      showToast({ title: 'Reporte generado', description: 'Puedes descargarlo abajo.' });
    } catch (err) {
      console.error(err);
      showToast({ title: 'Error al generar el reporte' });
    } finally {
      setLoading(false); // Aseguramos que se desactive el loading al final del proceso
    }
  };

  return (
    <div className='grid grid-cols-1 gap-4'>
      <h2 className="text-2xl font-bold mb-4 ">Reporte de {seccion}</h2>

      <SelectConBuscador
        options={clientes}
        value={clienteId}
        onChange={setClienteId}
        withSearch
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateCalendar label="Fecha inicio" value={startDate} onChange={setStartDate} />
        <DateCalendar label="Fecha fin" value={endDate} onChange={setEndDate} />
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center">
            <Loader className="animate-spin mr-2" />
            <span>Generando reporte...</span>
            </div>
            ) : (
            <button
              onClick={generarReporte}
              className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-600"
              disabled={loading}
              >
                Generar Reporte
            </button>
          )}
      </div>
    
      {newreport && ultimoReporte && (
        <div className="mt-4">
          <p className="text-sm mb-2">Último reporte generado:</p>
          <a
            href={`/reportes/${seccion}/${ultimoReporte}`}
            download
            className="text-blue-600 underline"
          >
            Descargar {ultimoReporte}
          </a>
        </div>
      )}
    </div>
  );
}
