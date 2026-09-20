import Link from 'next/link';
import Image from 'next/image';
import BotonAgregar from '@/components/BotonAgregar';

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
    return atleta.imagen;
  }
  if (atleta?.imagen) {
    return `/${atleta.imagen}`;
  }
  return '/logo.png';
};

export default async function Deportes() {
  const respuesta = await fetch('http://localhost:3000/atletas', { cache: 'no-store' });
  const atletas = await respuesta.json();

  return (
    <main className="min-h-screen bg-navy p-8">
      <div className="flex items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl">⚽</span>
          <h1 className="font-title text-3xl font-bold text-white whitespace-nowrap">
            Atletas Destacados
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
            placeholder="Buscar atleta..."
            className="bg-white/10 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-400 outline-none focus:bg-white/15 w-64"
          />
        </div>

        <BotonAgregar href="/deportes/nuevo">Agregar atleta</BotonAgregar>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {atletas.map((atleta) => (
          <li key={atleta._id}>
            <Link
              href={`/deportes/${atleta._id}`}
              className="block bg-white rounded-xl overflow-hidden hover:-translate-y-1 transition-transform"
              style={{ boxShadow: `0 8px 24px ${colorPorNombre(atleta.nombre)}` }}
            >
              <div className="h-64 bg-white relative p-3">
                <Image
                  src={imagenDe(atleta)}
                  alt={atleta.nombre}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <p className="font-bold text-ink">{atleta.nombre}</p>
                <p className="text-sm text-secondary">{atleta.equipo}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}