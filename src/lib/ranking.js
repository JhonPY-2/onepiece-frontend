export function formatearRecompensa(recompensa) {
  return `${Number(recompensa).toLocaleString()} berries`;
}

export function formatearTripulacion(tripulacion) {
  return tripulacion === null || tripulacion === undefined || tripulacion === ''
    ? 'Sin tripulación'
    : String(tripulacion);
}

export function esListaRankingValida(datos) {
  if (!Array.isArray(datos)) {
    return false;
  }

  return datos.every(
    (entrada) =>
      entrada !== null &&
      typeof entrada === 'object' &&
      typeof entrada.nombre === 'string' &&
      typeof entrada.recompensa === 'number' &&
      Number.isFinite(entrada.recompensa) &&
      (entrada.tripulacion === null || typeof entrada.tripulacion === 'string')
  );
}
