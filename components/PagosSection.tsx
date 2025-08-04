
import { getTransacciones } from '../services/pagoService';
import ReporteSeccion from './reportes/ReportesSection';

export default function PagosSection() {
  return (
    <ReporteSeccion
      seccion="transacciones"
      fetchData={getTransacciones}
    />
  );
}