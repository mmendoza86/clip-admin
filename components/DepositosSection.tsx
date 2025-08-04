
import { getDepositos } from '@/services/depositoService';
import { getTransacciones } from '../services/pagoService';
import ReporteSeccion from './reportes/ReportesSection';


export default function DepositosSection() {

  return (
    <ReporteSeccion
      seccion="depositos"
      fetchData={getDepositos}
    />
  );
}
