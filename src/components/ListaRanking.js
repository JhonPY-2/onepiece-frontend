import { formatearRecompensa, formatearTripulacion } from '@/lib/ranking';

export default function ListaRanking({ entradas }) {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    return (
      <p className="text-white text-lg text-center py-16">
        No hay personajes en el ranking
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {entradas.map((entrada, i) => (
        <li
          key={`${entrada.nombre}-${i}`}
          className="bg-white rounded-xl p-4 flex items-center gap-4"
        >
          <span className="font-title text-2xl font-bold text-gold w-8 text-center shrink-0">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <span className="block font-bold text-ink break-words">
              {entrada.nombre}
            </span>
            <span className="block text-sm text-secondary break-words">
              {formatearRecompensa(entrada.recompensa)}
            </span>
          </div>
          <span className="text-sm text-secondary text-right break-words">
            {formatearTripulacion(entrada.tripulacion)}
          </span>
        </li>
      ))}
    </ol>
  );
}
