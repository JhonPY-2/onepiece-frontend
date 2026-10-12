'use client';

export default function Error({ retry }) {
  return (
    <main className="min-h-screen bg-navy p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-title text-3xl font-bold text-white mb-8">
          Ranking de recompensas
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-ink mb-4">
            No se pudo cargar el ranking. Inténtalo de nuevo.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="bg-gold text-white font-semibold px-4 py-2 rounded-lg hover:bg-gold/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    </main>
  );
}
