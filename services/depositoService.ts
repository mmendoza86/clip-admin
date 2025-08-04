import api from './api';

export const getDepositos = (
  from: Date | null,
  to: Date | null,
  clienteId: number | string
) => {
  const formatDate = (date: Date | null) =>
    date ? date.toISOString().slice(0, 10) : null;

  return api.post('/clip/settlements', {
    from: formatDate(from),
    to: formatDate(to),
    clienteId
  });
};

