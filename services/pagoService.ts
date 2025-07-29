/*
import api from './api';

export const getPagos = (clienteId?: number) => {
  return api.get('/pagos', {
    params: clienteId ? { clienteId } : {},
  });
};
*/

import axios from 'axios';

const apiUrl = '/api/transacciones';

export const getTransacciones = (endDate: Date | null, startDate: Date | null, clienteId: number | string) => axios.get(apiUrl, {
  params: {
    endDate,
    startDate,
    clienteId
  }
});