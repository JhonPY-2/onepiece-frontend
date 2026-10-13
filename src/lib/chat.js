export const RESPUESTA_DEMO =
  '(Respuesta de demostración) El Rey de los Piratas, Gol D. Roger, dejó su tesoro, el One Piece, y quien lo encuentre heredará su título.';

export const ESPERA_MS = 2000;

export function esMensajeVacio(texto) {
  return String(texto ?? '').trim().length === 0;
}

export function crearMensaje(texto, autor, id) {
  return { id, autor, texto };
}

export async function enviarMensajeChat(mensaje) {
  await new Promise((resolve) => setTimeout(resolve, ESPERA_MS));
  return RESPUESTA_DEMO;
}
