import { describe, expect, it } from 'vitest';
import {
  esListaRankingValida,
  formatearRecompensa,
  formatearTripulacion,
} from './ranking';

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
