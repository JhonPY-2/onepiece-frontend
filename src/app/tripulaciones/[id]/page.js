import Image from 'next/image';
import Link from 'next/link';
import BotonesAccionTripulacion from './BotonesAccion';
import { API_URL } from '@/lib/api';

const imagenDe = (tripulacion) => {
  if (tripulacion?.imagen && String(tripulacion.imagen).startsWith('http')) {
    return tripulacion.imagen;
  }
  if (tripulacion?.imagen) {
    return `/${tripulacion.imagen}`;
  }
  return '/logo.png';
};

const imagenDePersonaje = (personaje) => {
  if (personaje?.imagen && String(personaje.imagen).startsWith('http')) {
    return personaje.imagen;
  }
  if (personaje?.imagen) {
    return `/${personaje.imagen}`;
  }
  return '/logo.png';
};

export default async function PaginaTripulacion({ params }) {
  const { id } = await params;

  const respuesta = await fetch(`${API_URL}/tripulaciones`, { cache: 'no-store' });

  if (!respuesta.ok) {
    return (
      <main className="min-h-screen bg-navy p-8">
        <h1 className="font-title text-3xl font-bold text-white">Tripulación no encontrada</h1>
      </main>
    );
  }

  const tripulaciones = await respuesta.json();
  const tripulacion = tripulaciones.find((t) => t._id === id);

  if (!tripulacion) {
    return (
      <main className="min-h-screen bg-navy p-8">
        <h1 className="font-title text-3xl font-bold text-white">Tripulación no encontrada</h1>
      </main>
    );
  }

  const respuestaMiembros = await fetch(`${API_URL}/tripulaciones/${id}/personajes`, {
    cache: 'no-store'
  });
  const miembros = respuestaMiembros.ok ? await respuestaMiembros.json() : [];

  return (
    <main className="min-h-screen bg-navy p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0 w-full md:w-80">
          <div className="h-80 md:h-96 bg-surface-alt rounded-2xl overflow-hidden">
            <Image
              src={imagenDe(tripulacion)}
              alt={tripulacion.nombre}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-title text-4xl font-bold text-white mb-1">
            {tripulacion.nombre}
          </h1>
          <span className="inline-block bg-gold/15 text-gold rounded-full px-3 py-1 mb-6">
            {tripulacion.capitan}
          </span>

          <p className="text-gray-200 mb-4 text-lg">
            <span className="text-secondary">Miembros:</span>{' '}
            {miembros.length}
          </p>

          {tripulacion.descripcion && (
            <div className="mb-4">
              <p className="text-secondary text-sm mb-1">Descripción:</p>
              <p className="text-white">{tripulacion.descripcion}</p>
            </div>
          )}

          {tripulacion.fotoCapitan && (
            <div className="mb-6">
              <p className="text-secondary text-sm mb-1">Foto del capitán:</p>
              <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                <Image
                  src={tripulacion.fotoCapitan}
                  alt={`Capitán de ${tripulacion.nombre}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <BotonesAccionTripulacion id={tripulacion._id} />
        </div>
      </div>

      {miembros.length > 0 && (
        <section className="mt-12">
          <h2 className="font-title text-2xl font-bold text-white mb-6">Miembros</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {miembros.map((personaje) => (
              <li key={personaje._id}>
                <Link
                  href={`/personajes/${personaje._id}`}
                  className="block bg-white rounded-xl overflow-hidden hover:-translate-y-1 transition-transform"
                  style={{ boxShadow: '0 8px 24px rgba(212, 160, 52, 0.35)' }}
                >
                  <div className="h-40 bg-white relative">
                    <Image
                      src={imagenDePersonaje(personaje)}
                      alt={personaje.nombre}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-ink text-center truncate">{personaje.nombre}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}