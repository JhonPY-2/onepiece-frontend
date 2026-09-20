import Link from 'next/link';
import Image from 'next/image';
import BotonAgregar from '@/components/BotonAgregar';

const resplandores = [
  { clave: 'luffy', color: '#D4A034' },
  { clave: 'zoro', color: '#4A7C59' },
  { clave: 'nami', color: '#E8964A' },
  { clave: 'robin', color: '#8B6FB0' },
  { clave: 'sanji', color: '#4A6FA5' },
  { clave: 'chopper', color: '#E89BAF' },
];

const resplandorPorNombre = (nombre) => {
  const nombreMinuscula = nombre?.toLowerCase() ?? '';
  return resplandores.find((r) => nombreMinuscula.includes(r.clave))?.color ?? '#D4A034';
};

// Mapeo nombre -> archivo de imagen en /public
// Si el personaje no tiene imagen propia todavía, cae en el logo como placeholder
const imagenes = [
  { clave: 'luffy', archivo: '/luffy.png' },
  { clave: 'zoro', archivo: '/zoro.png' },
  { clave: 'nami', archivo: '/nami.png' },
  { clave: 'robin', archivo: '/robin.png' },
  { clave: 'sanji', archivo: '/sanji2.png' },
  { clave: 'chopper', archivo: '/chopper.png' },
];

const imagenPorNombre = (nombre) => {
  const nombreMinuscula = nombre?.toLowerCase() ?? '';
  return imagenes.find((i) => nombreMinuscula.includes(i.clave))?.archivo ?? '/logo.png';
};

const imagenDe = (personaje) => {
  if (personaje?.imagen && String(personaje.imagen).startsWith('http')) {
    return personaje.imagen;
  }
  if (personaje?.imagen) {
    return `/${personaje.imagen}`;
  }
  return imagenPorNombre(personaje?.nombre);
};

async function obtenerPersonajes() {
  const respuesta = await fetch('http://localhost:3000/personajes', {
    cache: 'no-store'
  });
  const datos = await respuesta.json();
  return datos;
}

export default async function Home() {
  const personajes = await obtenerPersonajes();

  return (
    <main className="min-h-screen bg-navy p-8">
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
            placeholder="Buscar personaje..."
            className="bg-white/10 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-400 outline-none focus:bg-white/15 w-64"
          />
        </div>

        <BotonAgregar href="/personajes/nuevo">Agregar personaje</BotonAgregar>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {personajes.map((personaje) => (
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
                <p className="text-sm text-secondary">{personaje.tripulacion}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}