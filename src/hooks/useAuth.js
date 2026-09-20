'use client';

import { useSyncExternalStore } from 'react';

function suscribirse(callback) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function obtenerToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function decodificarToken(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const binario = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const texto = new TextDecoder().decode(
      Uint8Array.from(binario, (caracter) => caracter.charCodeAt(0))
    );
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

export default function useAuth() {
  const token = useSyncExternalStore(suscribirse, obtenerToken, () => null);
  const payload = token ? decodificarToken(token) : null;
  const email = payload?.email ?? (typeof window !== 'undefined' ? localStorage.getItem('email') : null);
  const username = payload?.username ?? (typeof window !== 'undefined' ? localStorage.getItem('username') : null);

  return {
    token,
    estaAutenticado: Boolean(token),
    email,
    username
  };
}