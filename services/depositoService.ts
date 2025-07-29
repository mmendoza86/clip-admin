import api from './api';

export const getDepositos = (clienteId?: number) => {
  return api.get('/depositos', {
    params: clienteId ? { clienteId } : {},
  });
};
