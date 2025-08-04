import api from './api';

export const getConciliacion = (
  from: Date | null,
  to: Date | null,
) => {
  const formatDate = (date: Date | null) =>
    date ? date.toISOString().slice(0, 10) : null;

  return api.get('/conciliation', {
    params: {
      fechaInicio: formatDate(from),
      fechaFin: formatDate(to),
    },
  });
};
