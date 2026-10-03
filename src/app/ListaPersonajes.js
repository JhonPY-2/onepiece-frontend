'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BotonAgregar from '@/components/BotonAgregar';
import { imagenDe, resplandorPorNombre } from '@/lib/personajes';

const normalizar = (texto) =>
  (texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function ListaPersonajes({ personajes }) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    if (!termino) return personajes;
    return personajes.filter((personaje) => normalizar(personaje.nombre).includes(termino));
  }, [busqueda, personajes]);

  return (
    <>
      <div className="flex items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl">🏴‍☠️</span>
          <h1 className="font-title text-3xl font-bold text-white whitespace-nowrap">
            Personajes de One Piece
          </h1>
        </div>

        <div className="relative">
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar personaje..."
            aria-label="Buscar personaje por nombre"
            className="bg-white/10 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-400 outline-none focus:bg-white/15 w-64"
          />
        </div>

        <BotonAgregar href="/personajes/nuevo">Agregar personaje</BotonAgregar>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white text-lg mb-4">No se encontraron personajes</p>
          <button
            type="button"
            onClick={() => setBusqueda('')}
            className="bg-gold text-white font-semibold px-4 py-2 rounded-lg"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtrados.map((personaje) => (
            <li key={personaje._id}>
              <Link
                href={`/personajes/${personaje._id}`}
                className="block bg-white rounded-xl overflow-hidden hover:-translate-y-1 transition-transform"
                style={{ boxShadow: `0 8px 24px ${resplandorPorNombre(personaje.nombre)}` }}
              >
                <div className="h-64 bg-white relative p-3">
                  <Image
                    src={imagenDe(personaje)}
                    alt={personaje.nombre}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-ink">{personaje.nombre}</p>
                  <p className="text-sm text-secondary">{personaje.tripulacionNombre}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}