// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_URL } from '@/lib/api';
import {
  aListaRanking,
  esListaRankingValida,
  formatearRecompensa,
  formatearTripulacion,
  obtenerRanking,
} from './ranking';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('formatearRecompensa', () => {
  it('devuelve el número con separadores y el sufijo " berries"', () => {
    expect(formatearRecompensa(3300000000)).toBe(
      `${Number(3300000000).toLocaleString()} berries`
    );
  });
});

describe('formatearTripulacion', () => {
  it('devuelve "Sin tripulación" cuando es null', () => {
    expect(formatearTripulacion(null)).toBe('Sin tripulación');
  });

  it('devuelve "Sin tripulación" cuando es undefined', () => {
    expect(formatearTripulacion(undefined)).toBe('Sin tripulación');
  });

  it('devuelve "Sin tripulación" cuando es cadena vacía', () => {
    expect(formatearTripulacion('')).toBe('Sin tripulación');
  });

  it('devuelve el texto tal cual cuando hay tripulación', () => {
    expect(formatearTripulacion('Sombrero de Paja')).toBe('Sombrero de Paja');
  });
});

describe('esListaRankingValida', () => {
  it('devuelve true para una lista vacía', () => {
    expect(esListaRankingValida([])).toBe(true);
  });

  it('devuelve true para una lista con entradas válidas', () => {
    expect(
      esListaRankingValida([
        { nombre: 'Luffy', recompensa: 3300000000, tripulacion: 'Sombrero de Paja' },
        { nombre: 'Zoro', recompensa: 1111000000, tripulacion: null },
      ])
    ).toBe(true);
  });

  it('devuelve false cuando no es un array', () => {
    expect(esListaRankingValida({ nombre: 'Luffy' })).toBe(false);
    expect(esListaRankingValida(null)).toBe(false);
    expect(esListaRankingValida(undefined)).toBe(false);
  });

  it('devuelve false cuando a una entrada le faltan campos', () => {
    expect(
      esListaRankingValida([{ nombre: 'Luffy', recompensa: 3300000000 }])
    ).toBe(false);
  });

  it('devuelve false cuando recompensa no es numérica o no es finita', () => {
    expect(
      esListaRankingValida([{ nombre: 'Luffy', recompensa: 'mucho', tripulacion: null }])
    ).toBe(false);
    expect(
      esListaRankingValida([{ nombre: 'Luffy', recompensa: Infinity, tripulacion: null }])
    ).toBe(false);
    expect(
      esListaRankingValida([{ nombre: 'Luffy', recompensa: NaN, tripulacion: null }])
    ).toBe(false);
  });

  it('devuelve false cuando tripulacion tiene un tipo incorrecto', () => {
    expect(
      esListaRankingValida([{ nombre: 'Luffy', recompensa: 3300000000, tripulacion: 123 }])
    ).toBe(false);
  });
});

describe('aListaRanking', () => {
  it('conserva el orden exacto recibido', () => {
    const datos = [
      { nombre: 'Luffy', recompensa: 3300000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Zoro', recompensa: 1111000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Nami', recompensa: 366000000, tripulacion: null },
    ];

    const resultado = aListaRanking(datos);

    expect(resultado.map((entrada) => entrada.nombre)).toEqual(['Luffy', 'Zoro', 'Nami']);
    expect(resultado).toEqual([
      { nombre: 'Luffy', recompensa: 3300000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Zoro', recompensa: 1111000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Nami', recompensa: 366000000, tripulacion: null },
    ]);
  });

  it('normaliza tripulacion ausente a null', () => {
    const resultado = aListaRanking([{ nombre: 'Luffy', recompensa: 3300000000 }]);

    expect(resultado).toEqual([
      { nombre: 'Luffy', recompensa: 3300000000, tripulacion: null },
    ]);
  });
});

describe('obtenerRanking', () => {
  it('llama a `${API_URL}/personajes/ranking` con cache no-store y sin parámetros', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal('fetch', fetchMock);

    await obtenerRanking();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/personajes/ranking`, {
      cache: 'no-store',
    });
  });

  it('lanza error cuando la respuesta no es exitosa', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) })
    );

    await expect(obtenerRanking()).rejects.toThrow();
  });

  it('lanza error cuando el JSON no cumple el formato', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ nombre: 'Luffy' }),
      })
    );

    await expect(obtenerRanking()).rejects.toThrow();
  });

  it('propaga el error cuando json() rechaza', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('json roto');
        },
      })
    );

    await expect(obtenerRanking()).rejects.toThrow('json roto');
  });

  it('con una lista válida devuelve la lista mapeada en el mismo orden', async () => {
    const datos = [
      { nombre: 'Luffy', recompensa: 3300000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Zoro', recompensa: 1111000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Nami', recompensa: 366000000, tripulacion: null },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => datos })
    );

    const resultado = await obtenerRanking();

    expect(resultado).toEqual(datos);
  });
});
