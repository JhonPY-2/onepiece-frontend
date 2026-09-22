import Image from 'next/image';
import BotonesAccionDeporte from './BotonesAccion';
import { API_URL } from '@/lib/api';

const colores = [
  { clave: 'messi', color: '#F72585' },
  { clave: 'lebron', color: '#8B5CF6' },
  { clave: 'serena', color: '#EC4899' },
  { clave: 'bolt', color: '#D4E157' },
  { clave: 'phelps', color: '#22D3EE' },
  { clave: 'biles', color: '#EF4444' }
];

const colorPorNombre = (nombre) => {
  const n = (nombre || '').toLowerCase();
  const encontrado = colores.find((c) => n.includes(c.clave));
  return encontrado ? encontrado.color : '#D4A034';
};

const imagenDe = (atleta) => {
  if (atleta?.imagen && String(atleta.imagen).startsWith('http')) {
    return atleta.imagen.replace('/upload/', '/upload/f_auto,q_auto,w_400/');
  }
  if (atleta?.imagen) {
    return `/${atleta.imagen}`;
  }
  return '/logo.png';
};

export default async function PaginaDeporte({ params }) {
  const { id } = await params;

  const respuesta = await fetch(`${API_URL}/atletas/${id}`, {
    cache: 'no-store'
  });

  if (!respuesta.ok) {
    return (
      <main className="min-h-screen bg-navy p-8">
        <h1 className="font-title text-3xl font-bold text-white">Atleta no encontrado</h1>
      </main>
    );
  }

  const atleta = await respuesta.json();

  return (
    <main className="min-h-screen bg-navy p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0 w-full md:w-80">
          <div
            className="h-80 md:h-96 bg-surface-alt rounded-2xl overflow-hidden"
            style={{ boxShadow: `0 8px 24px ${colorPorNombre(atleta.nombre)}` }}
          >
            <Image
              src={imagenDe(atleta)}
              alt={atleta.nombre}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-title text-4xl font-bold text-white mb-1">
            {atleta.nombre}
          </h1>
          <span className="inline-block bg-gold/15 text-gold rounded-full px-3 py-1 mb-6">
            {atleta.equipo}
          </span>

          <div className="mb-4">
            <p className="text-secondary text-sm mb-1">Logros:</p>
            <p className="text-white">{atleta.logros}</p>
          </div>

          <div className="mb-4">
            <p className="text-secondary text-sm mb-1">Posición:</p>
            <p className="text-white">{atleta.posicion}</p>
          </div>

          <div className="mb-6">
            <p className="text-secondary text-sm mb-1">Estadísticas:</p>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              {atleta.estadisticas.map((estadistica) => (
                <li key={estadistica}>{estadistica}</li>
              ))}
            </ul>
          </div>

          <BotonesAccionDeporte id={atleta._id} />
        </div>
      </div>
    </main>
  );
}