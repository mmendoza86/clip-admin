// components/DateCalendar.tsx
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export default function DateCalendar({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <DatePicker
        selected={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        dateFormat="yyyy-MM-dd"
        placeholderText="Selecciona una fecha"
      />
    </div>
  );
}
