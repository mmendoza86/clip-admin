import api from './api';

export const getClientes = () => api.get('/clientes');
export const getCliente = (id: number) => api.get(`/clientes/${id}`);
export const createCliente = (data: any) => api.post('/clientes', data);
export const updateCliente = (id: number, data: any) => api.put(`/clientes/${id}`, data);
export const deleteCliente = (id: number) => api.delete(`/clientes/${id}`);
/*
import axios from 'axios';

const apiUrl = '/api/clientes';

export const getClientes = () => axios.get(apiUrl);

export const createCliente = (cliente: any) => axios.post(apiUrl, cliente);

export const updateCliente = (id: number, cliente: any) =>
  axios.put(`${apiUrl}?id=${id}`, cliente);

export const deleteCliente = (id: number) =>
  axios.delete(`${apiUrl}?id=${id}`);

*/