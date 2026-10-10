import { API_URL } from '@/lib/api';

export function formatearRecompensa(recompensa) {
  return `${Number(recompensa).toLocaleString()} berries`;
}

export function formatearTripulacion(tripulacion) {
  return tripulacion === null || tripulacion === undefined || tripulacion === ''
    ? 'Sin tripulación'
    : String(tripulacion);
}

export function aListaRanking(datos) {
  return datos.map((entrada) => ({
    nombre: entrada.nombre,
    recompensa: entrada.recompensa,
    tripulacion: entrada.tripulacion ?? null,
  }));
}

export async function obtenerRanking() {
  const respuesta = await fetch(`${API_URL}/personajes/ranking`, {
    cache: 'no-store',
  });

  if (!respuesta.ok) {
    throw new Error('respuesta no exitosa');
  }

  const datos = await respuesta.json();

  if (!esListaRankingValida(datos)) {
    throw new Error('cuerpo inválido');
  }

  return aListaRanking(datos);
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
