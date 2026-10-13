// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ESPERA_MS,
  RESPUESTA_DEMO,
  crearMensaje,
  enviarMensajeChat,
  esMensajeVacio,
} from './chat';

const TEXTO_DEMO_RF7 =
  '(Respuesta de demostración) El Rey de los Piratas, Gol D. Roger, dejó su tesoro, el One Piece, y quien lo encuentre heredará su título.';

afterEach(() => {
  vi.useRealTimers();
});

describe('esMensajeVacio', () => {
  it('devuelve true para cadena vacía', () => {
    expect(esMensajeVacio('')).toBe(true);
  });

  it('devuelve true para solo espacios', () => {
    expect(esMensajeVacio('   ')).toBe(true);
  });

  it('devuelve true para solo espacios, saltos y tabs', () => {
    expect(esMensajeVacio(' \n\t ')).toBe(true);
  });

  it('devuelve true para null', () => {
    expect(esMensajeVacio(null)).toBe(true);
  });

  it('devuelve true para undefined', () => {
    expect(esMensajeVacio(undefined)).toBe(true);
  });

  it('devuelve false para texto con contenido', () => {
    expect(esMensajeVacio('hola')).toBe(false);
  });

  it('devuelve false para texto con espacios alrededor', () => {
    expect(esMensajeVacio('  hola ')).toBe(false);
  });
});

describe('RESPUESTA_DEMO', () => {
  it('empieza por "(Respuesta de demostración)"', () => {
    expect(RESPUESTA_DEMO.startsWith('(Respuesta de demostración)')).toBe(true);
  });

  it('coincide con el texto fijo exacto de RF-7', () => {
    expect(RESPUESTA_DEMO).toBe(TEXTO_DEMO_RF7);
  });
});

describe('crearMensaje', () => {
  it('devuelve { id, autor, texto }', () => {
    expect(crearMensaje('x', 'usuario', 1)).toEqual({
      id: 1,
      autor: 'usuario',
      texto: 'x',
    });
  });
});

describe('enviarMensajeChat', () => {
  it('no resuelve antes de 1500 ms y sí con RESPUESTA_DEMO al completar 3000 ms (RF-22)', async () => {
    vi.useFakeTimers();

    let resuelto = false;
    let valor = null;
    const promesa = enviarMensajeChat('x').then((respuesta) => {
      resuelto = true;
      valor = respuesta;
    });

    await vi.advanceTimersByTimeAsync(1499);
    expect(resuelto).toBe(false);

    await vi.advanceTimersByTimeAsync(3000 - 1499);
    await promesa;
    expect(resuelto).toBe(true);
    expect(valor).toBe(RESPUESTA_DEMO);
  });

  // RF-8: la respuesta de demostración ignora la entrada a propósito, por eso
  // este test solo comprueba que el texto fijo es el mismo (no depende del mensaje).
  it('dos mensajes distintos resuelven la misma RESPUESTA_DEMO', async () => {
    vi.useFakeTimers();

    const primera = enviarMensajeChat('¿Quién es Luffy?');
    const segunda = enviarMensajeChat('¿Cuántos arcos tiene One Piece?');
    await vi.advanceTimersByTimeAsync(ESPERA_MS);

    await expect(primera).resolves.toBe(RESPUESTA_DEMO);
    await expect(segunda).resolves.toBe(RESPUESTA_DEMO);
  });
});
