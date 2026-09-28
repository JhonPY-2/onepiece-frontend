import Link from 'next/link';
import Image from 'next/image';
import BotonAgregar from '@/components/BotonAgregar';
import { API_URL } from '@/lib/api';

const resplandor = '#D4A034';

const imagenDe = (tripulacion) => {
  if (tripulacion?.imagen && String(tripulacion.imagen).startsWith('http')) {
    return tripulacion.imagen;
  }
  if (tripulacion?.imagen) {
    return `/${tripulacion.imagen}`;
  }
  return '/logo.png';
};

export default async function Tripulaciones() {
  const respuesta = await fetch(`${API_URL}/tripulaciones`, { cache: 'no-store' });
  const tripulaciones = await respuesta.json();

  return (
    <main className="min-h-screen bg-navy p-8">
      <div className="flex items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl">🏴‍☠️</span>
          <h1 className="font-title text-3xl font-bold text-white whitespace-nowrap">
            Tripulaciones
          </h1>
        </div>

        <BotonAgregar href="/tripulaciones/nuevo">Agregar tripulación</BotonAgregar>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tripulaciones.map((tripulacion) => (
          <li key={tripulacion._id}>
            <Link
              href={`/tripulaciones/${tripulacion._id}`}
              className="block bg-white rounded-xl overflow-hidden hover:-translate-y-1 transition-transform"
              style={{ boxShadow: `0 8px 24px ${resplandor}` }}
            >
              <div className="h-64 bg-white relative p-3">
                <Image
                  src={imagenDe(tripulacion)}
                  alt={tripulacion.nombre}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <p className="font-bold text-ink">{tripulacion.nombre}</p>
                <p className="text-sm text-secondary">{tripulacion.capitan}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}