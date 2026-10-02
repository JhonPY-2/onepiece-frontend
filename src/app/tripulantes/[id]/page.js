import Image from 'next/image';
import Link from 'next/link';
import BotonesAccionTripulante from './BotonesAccion';
import { API_URL } from '@/lib/api';

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

const imagenDe = (tripulante) => {
  if (tripulante?.imagen && String(tripulante.imagen).startsWith('http')) {
    return tripulante.imagen.replace('/upload/', '/upload/f_auto,q_auto,w_400/');
  }
  if (tripulante?.imagen) {
    return `/${tripulante.imagen}`;
  }
  return imagenPorNombre(tripulante?.nombre);
};

async function obtenerTripulante(id) {
  const respuesta = await fetch(`${API_URL}/tripulantes/${id}`, {
    cache: 'no-store'
  });
  const datos = await respuesta.json();
  return datos;
}

export default async function PaginaTripulante({ params }) {
  const { id } = await params;
  const tripulante = await obtenerTripulante(id);

  const idTripulacion = tripulante.tripulacion?._id ?? tripulante.tripulacion ?? '';

  return (
    <main className="min-h-screen bg-navy p-8">
      <Link
        href={`/tripulaciones/${idTripulacion}`}
        className="inline-block text-secondary hover:text-gray-300 mb-6"
      >
        ← Volver a la tripulación
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0 w-full md:w-80">
          <div
            className="h-80 md:h-96 bg-surface-alt rounded-2xl overflow-hidden"
            style={{ boxShadow: `0 8px 24px ${resplandorPorNombre(tripulante.nombre)}` }}
          >
            <Image
              src={imagenDe(tripulante)}
              alt={tripulante.nombre}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-title text-4xl font-bold text-white mb-1">
            {tripulante.nombre}
          </h1>
          <span className="inline-block bg-gold/15 text-gold rounded-full px-3 py-1 mb-6">
            {tripulante.tripulacion?.nombre}
          </span>

          <p className="text-gray-200 mb-4 text-lg">
            <span className="text-secondary">Recompensa:</span>{' '}
            {tripulante.recompensa.toLocaleString()} berries
          </p>

          {tripulante.frutaDiablo?.nombre && (
            <div className="mb-4">
              <p className="text-secondary text-sm mb-1">Fruta del Diablo:</p>
              <p className="text-white">
                {tripulante.frutaDiablo.nombre} ({tripulante.frutaDiablo.tipo})
              </p>
            </div>
          )}

          <div className="mb-6">
            <p className="text-secondary text-sm mb-1">Habilidades:</p>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              {tripulante.habilidades.map((habilidad) => (
                <li key={habilidad}>{habilidad}</li>
              ))}
            </ul>
          </div>

          {tripulante.arcos?.length > 0 && (
            <div className="mb-6">
              <p className="text-secondary text-sm mb-1">Arcos:</p>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                {tripulante.arcos.map((arco) => (
                  <li key={arco}>{arco}</li>
                ))}
              </ul>
            </div>
          )}

          <BotonesAccionTripulante id={tripulante._id} idTripulacion={idTripulacion} />
        </div>
      </div>
    </main>
  );
}