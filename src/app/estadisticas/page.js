async function obtenerEstadisticas() {
  try {
    const respuesta = await fetch('http://localhost:3000/estadisticas/resumen', {
      cache: 'no-store'
    });

    if (!respuesta.ok) {
      return null;
    }

    return await respuesta.json();
  } catch {
    return null;
  }
}

export default async function Estadisticas() {
  const datos = await obtenerEstadisticas();

  if (!datos) {
    return (
      <main className="min-h-screen bg-navy p-8">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">📊</span>
          <h1 className="font-title text-3xl font-bold text-white whitespace-nowrap">
            Estadísticas
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl">
          <p className="text-secondary">No se pudieron cargar las estadísticas</p>
        </div>
      </main>
    );
  }

  const totalPersonajes = datos.total_personajes ?? 0;
  const totalAtletas = datos.total_atletas ?? 0;
  const mayorRecompensa = datos.personaje_mayor_recompensa;
  const recompensaFormateada =
    mayorRecompensa?.recompensa != null
      ? Number(mayorRecompensa.recompensa).toLocaleString('en-US')
      : null;

  return (
    <main className="min-h-screen bg-navy p-8">
      <div className="flex items-center gap-3 mb-10">
        <span className="text-3xl">📊</span>
        <h1 className="font-title text-3xl font-bold text-white whitespace-nowrap">
          Estadísticas
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2">
          <p className="text-secondary">Total de Personajes</p>
          <p className="font-title font-bold text-4xl text-gold">{totalPersonajes}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2">
          <p className="text-secondary">Total de Atletas</p>
          <p className="font-title font-bold text-4xl text-gold">{totalAtletas}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2">
          <p className="text-secondary">Mayor Recompensa</p>
          {mayorRecompensa ? (
            <>
              <p className="font-bold text-2xl text-ink">{mayorRecompensa.nombre}</p>
              <p className="font-title font-bold text-3xl text-gold">{recompensaFormateada}</p>
            </>
          ) : (
            <p className="text-secondary">Sin datos</p>
          )}
        </div>
      </div>
    </main>
  );
}