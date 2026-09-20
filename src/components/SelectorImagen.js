'use client';

import { useRef } from 'react';

export default function SelectorImagen({ preview, onSeleccionar }) {
  const inputRef = useRef(null);

  function abrirSelector() {
    inputRef.current?.click();
  }

  return (
    <div className="hidden md:block w-80 h-80 bg-surface-alt rounded-2xl overflow-hidden shrink-0 relative">
      <div
        onClick={abrirSelector}
        className="w-full h-full cursor-pointer relative"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: URLs no pasan por el optimizador
          <img
            src={preview}
            alt="Vista previa"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-secondary">Subir foto</p>
          </div>
        )}
      </div>

      {preview && (
        <button
          type="button"
          aria-label="Cambiar foto"
          onClick={(e) => {
            e.stopPropagation();
            abrirSelector();
          }}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-gold text-white shadow-md flex items-center justify-center cursor-pointer hover:bg-gold/90"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const archivo = e.target.files?.[0] ?? null;
          onSeleccionar(archivo);
          e.target.value = '';
        }}
      />
    </div>
  );
}