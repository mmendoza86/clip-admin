import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getConciliacion } from '@/services/conciliacionService';
import { ConciliacionDetalle } from './types/exportTypes';
import DateCalendar from './utils/DateCalendar';
import axios from 'axios';
import ConciliacionTable from './conciliacion/ConciliacionTable';
import { Loader } from 'lucide-react';


export default function ConciliacionSection() {
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [conciliacion, setConciliacion] = useState<ConciliacionDetalle[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generarConciliacion = async () => {
    if (!startDate || !endDate) {
      showToast({
        title: 'Fechas requeridas',
        description: 'Selecciona fecha de inicio y fin.'
      });
      return;
    }

    try {
      setLoading(true);
      const res = await getConciliacion(startDate, endDate);
      const data: ConciliacionDetalle[] = res.data;

      if (data) {
        setConciliacion(data);
      }
    }
    catch{
      showToast({
        title: 'Error',
        description: 'Ocurrió un error al generar la conciliación.'
      });
    }
    finally{
      setLoading(false);
    }
  };



  return (
    <div className='grid grid-cols-1 gap-4'>
      <h2 className="text-2xl font-bold mb-4">Reporte de conciliación</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateCalendar label="Fecha inicio" value={startDate} onChange={setStartDate} />
        <DateCalendar label="Fecha fin" value={endDate} onChange={setEndDate} />
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {loading ? (
          <div className="flex items-center">
            <Loader className="animate-spin mr-2" />
            <span>Generando reporte...</span>
            </div>
            ) : (
            <button
              onClick={generarConciliacion}
              className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-600"
            >
              Generar conciliación
            </button>
            )}
        
      </div>

      {conciliacion && conciliacion.length > 0 && (
      <ConciliacionTable data={conciliacion} />
    )}
    </div>
  );
}
