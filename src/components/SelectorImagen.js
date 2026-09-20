'use client';

import { useRef, useState } from 'react';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAXIMO = 5 * 1024 * 1024;

export default function SelectorImagen({ preview, onSeleccionar }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);

  function abrirSelector() {
    inputRef.current?.click();
  }

  function validarArchivo(archivo) {
    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      return 'Solo se aceptan imágenes JPEG, PNG o WebP';
    }
    if (archivo.size > TAMANO_MAXIMO) {
      return 'La imagen no puede superar los 5MB';
    }
    return null;
  }

  return (
    <div className="hidden md:flex flex-col gap-2 shrink-0">
      <div className="w-80 h-80 bg-surface-alt rounded-2xl overflow-hidden relative">
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
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const archivo = e.target.files?.[0] ?? null;

            if (archivo) {
              const mensajeError = validarArchivo(archivo);
              if (mensajeError) {
                setError(mensajeError);
                e.target.value = '';
                return;
              }
            }

            setError(null);
            onSeleccionar(archivo);
            e.target.value = '';
          }}
        />
      </div>

      {error && <p className="text-sm text-red-400 pl-1">{error}</p>}
    </div>
  );
}