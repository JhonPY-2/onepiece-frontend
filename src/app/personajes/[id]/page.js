import Image from 'next/image';
import BotonesAccion from './BotonesAccion';

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

async function obtenerPersonaje(id) {
  const respuesta = await fetch(`http://localhost:3000/personajes/${id}`, {
    cache: 'no-store'
  });
  const datos = await respuesta.json();
  return datos;
}

export default async function PaginaPersonaje({ params }) {
  const { id } = await params;
  const personaje = await obtenerPersonaje(id);

  return (
    <main className="min-h-screen bg-navy p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0 w-full md:w-80">
          <div
            className="h-80 md:h-96 bg-surface-alt rounded-2xl overflow-hidden"
            style={{ boxShadow: `0 8px 24px ${resplandorPorNombre(personaje.nombre)}` }}
          >
            <Image
              src={imagenDe(personaje)}
              alt={personaje.nombre}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-title text-4xl font-bold text-white mb-1">
            {personaje.nombre}
          </h1>
          <span className="inline-block bg-gold/15 text-gold rounded-full px-3 py-1 mb-6">
            {personaje.tripulacion}
          </span>

          <p className="text-gray-200 mb-4 text-lg">
            <span className="text-secondary">Recompensa:</span>{' '}
            {personaje.recompensa.toLocaleString()} berries
          </p>

          {personaje.frutaDiablo?.nombre && (
            <div className="mb-4">
              <p className="text-secondary text-sm mb-1">Fruta del Diablo:</p>
              <p className="text-white">
                {personaje.frutaDiablo.nombre} ({personaje.frutaDiablo.tipo})
              </p>
            </div>
          )}

          <div className="mb-6">
            <p className="text-secondary text-sm mb-1">Habilidades:</p>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              {personaje.habilidades.map((habilidad) => (
                <li key={habilidad}>{habilidad}</li>
              ))}
            </ul>
          </div>

          <BotonesAccion id={personaje._id} />
        </div>
      </div>
    </main>
  );
}