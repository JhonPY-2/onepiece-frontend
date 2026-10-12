import ListaRanking from '@/components/ListaRanking';
import { obtenerRanking } from '@/lib/ranking';

export default async function Ranking() {
  const entradas = await obtenerRanking();

  return (
    <main className="min-h-screen bg-navy p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-title text-3xl font-bold text-white mb-8">
          Ranking de recompensas
        </h1>
        <ListaRanking entradas={entradas} />
      </div>
    </main>
  );
}
