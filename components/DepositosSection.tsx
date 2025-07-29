import { useEffect, useState } from 'react';
import SelectConBuscador from './utils/SelectSearch';
import DateCalendar from './utils/DateCalendar';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getTransacciones } from '../services/pagoService';

interface ClienteOption {
  id: number;
  label: string;
}

export default function DepositosSection() {
  const [clienteId, setClienteId] = useState<number | string>(0);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 🧠 Cargar clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get('/api/clientes');
        const data = res.data;

        const opciones = [
          { id: 0, label: 'Todos los clientes' },
          ...data.map((c: any) => ({
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
      try {
        const res = await getTransacciones(endDate, startDate, clienteId);
        const data = res.data.results;
  
        // Transforma los datos que quieres exportar (ejemplo plano)
        const exportData = data.map(t => ({
          ID: t.id,
          Monto: t.amount,
          Moneda: t.currency,
          Estado: t.status,
          Aprobado: t.approved_at,
          Cliente: `${t.customer.first_name} ${t.customer.last_name}`,
          Correo: t.customer.email,
          Tarjeta: `**** ${t.payment_method.card.last_digits}`,
          Banco: t.payment_method.card.issuer,
        }));
  
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transacciones');
  
        console.log(clienteId);
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(file, `Transacciones_${clienteId && clienteId !== "0" ? clienteId : 'all'}_${startDate?.toISOString().slice(0, 10)}_${endDate?.toISOString().slice(0, 10)}.xlsx`);
      } catch (err) {
        alert('Error al generar el reporte');
      }
    };

  return (
    <div className='grid grid-cols-1 gap-4'>
      <h2 className="text-2xl font-bold mb-4">Reporte de Depósitos</h2>

      <div className="mb-4">
        <SelectConBuscador
          options={clientes}
          value={clienteId}
          onChange={setClienteId}
          withSearch={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateCalendar label="Fecha inicio" value={startDate} onChange={setStartDate} />
        <DateCalendar label="Fecha fin" value={endDate} onChange={setEndDate} />
      </div>

      <div className="mt-4">
        <button
          onClick={generarReporte}
          className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-600"
        >
          Generar Reporte
        </button>
      </div>
    </div>
  );
}
