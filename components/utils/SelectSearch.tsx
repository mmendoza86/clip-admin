// components/SelectConBuscador.tsx
import { useState, useMemo } from 'react';

interface Opcion {
  id: number | string;
  label: string;
}

interface Props {
  options: Opcion[];
  value: number | string;
  onChange: (value: number | string) => void;
  withSearch?: boolean; // si quieres mostrar campo de búsqueda o no
  placeholder?: string;
}

export default function SelectConBuscador({
  options,
  value,
  onChange,
  withSearch = true,
  placeholder = 'Selecciona una opción...'
}: Props) {
  const [search, setSearch] = useState('');

  const opcionesFiltradas = useMemo(() => {
    if (!withSearch || search.trim() === '') return options;

    return options.filter(opt =>
      opt.label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita acentos
        .toLowerCase()
        .includes(
          search
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
        )
    );
  }, [search, options, withSearch]);

  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {withSearch && (
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">{placeholder}</option>
        {opcionesFiltradas.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
