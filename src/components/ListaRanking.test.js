// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ListaRanking from './ListaRanking';
import { formatearRecompensa, formatearTripulacion } from '@/lib/ranking';

afterEach(() => {
  cleanup();
});

describe('ListaRanking', () => {
  it('muestra el mensaje de lista vacía cuando no hay entradas', () => {
    render(<ListaRanking entradas={[]} />);

    expect(screen.getByText('No hay personajes en el ranking')).toBeTruthy();
  });

  it('muestra las 3 entradas en el mismo orden con sus posiciones, recompensa y tripulación', () => {
    const entradas = [
      { nombre: 'Luffy', recompensa: 3300000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Zoro', recompensa: 1111000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Nami', recompensa: 366000000, tripulacion: 'Sombrero de Paja' },
    ];

    render(<ListaRanking entradas={entradas} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);

    entradas.forEach((entrada, i) => {
      const item = items[i];
      expect(within(item).getByText(String(i + 1))).toBeTruthy();
      expect(within(item).getByText(entrada.nombre)).toBeTruthy();
      expect(within(item).getByText(formatearRecompensa(entrada.recompensa))).toBeTruthy();
      expect(within(item).getByText(formatearTripulacion(entrada.tripulacion))).toBeTruthy();
    });
  });

  it('muestra "Sin tripulación" cuando la entrada tiene tripulacion null', () => {
    const entradas = [
      { nombre: 'Luffy', recompensa: 3300000000, tripulacion: 'Sombrero de Paja' },
      { nombre: 'Zoro', recompensa: 1111000000, tripulacion: null },
    ];

    render(<ListaRanking entradas={entradas} />);

    const items = screen.getAllByRole('listitem');
    expect(within(items[1]).getByText(formatearTripulacion(null))).toBeTruthy();
  });
});
