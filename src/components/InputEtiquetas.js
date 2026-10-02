'use client';

import { useState } from 'react';

export default function InputEtiquetas({ etiqueta, valores = [], onChange, placeholder }) {
  const [texto, setTexto] = useState('');
  const [error, setError] = useState(null);

  function agregar() {
    const valor = texto.trim();
    if (!valor) {
      return;
    }
    if (valores.includes(valor)) {
      setError('Esta etiqueta ya existe');
      return;
    }
    onChange([...valores, valor]);
    setTexto('');
    setError(null);
  }

  function quitar(valor) {
    onChange(valores.filter((v) => v !== valor));
  }

  return (
    <div>
      <label className="block text-gray-300 mb-1">{etiqueta}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={texto}
          placeholder={placeholder}
          onChange={(e) => {
            setTexto(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              agregar();
            }
          }}
          className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="button"
          onClick={agregar}
          aria-label={`Agregar ${etiqueta}`}
          className="bg-gold text-white font-semibold px-4 py-2 rounded-lg hover:bg-gold/90"
        >
          +
        </button>
      </div>

      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}

      {valores.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {valores.map((valor) => (
            <span
              key={valor}
              className="inline-flex items-center gap-1.5 bg-skill text-white rounded-full px-3 py-1 text-sm"
            >
              {valor}
              <button
                type="button"
                onClick={() => quitar(valor)}
                aria-label={`Quitar ${valor}`}
                className="text-white/80 hover:text-white text-xs leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}