'use client';

import { useEffect, useRef, useState } from 'react';
import CajaMensaje from '@/components/CajaMensaje';

const SUGERENCIAS = [
  '¿Quién es Monkey D. Luffy?',
  '¿Qué es la Fruta del Diablo?',
  '¿Cuántos arcos tiene One Piece?',
];

export default function Chat() {
  const [texto, setTexto] = useState('');
  const refCaja = useRef(null);

  useEffect(() => {
    refCaja.current?.focus();
  }, []);

  return (
    <>
      <h1 className="font-title text-2xl sm:text-3xl font-bold text-white mb-4">
        Chat de One Piece
      </h1>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
            <p className="text-white text-lg max-w-xl">
              ¡Hola! Soy tu asistente de One Piece. ¿Sobre qué quieres preguntar?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {SUGERENCIAS.map((sugerencia) => (
                <button
                  key={sugerencia}
                  type="button"
                  className="bg-white/10 hover:bg-white/15 text-white rounded-full px-4 py-2 text-sm"
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CajaMensaje valor={texto} onCambio={setTexto} refCaja={refCaja} />
    </>
  );
}
