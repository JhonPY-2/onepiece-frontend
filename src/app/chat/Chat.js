'use client';

import { useEffect, useRef, useState } from 'react';
import CajaMensaje from '@/components/CajaMensaje';
import ListaMensajes from '@/components/ListaMensajes';
import { crearMensaje, enviarMensajeChat, esMensajeVacio } from '@/lib/chat';

const SUGERENCIAS = [
  '¿Quién es Monkey D. Luffy?',
  '¿Qué es la Fruta del Diablo?',
  '¿Cuántos arcos tiene One Piece?',
];

export default function Chat() {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const enviandoRef = useRef(false);
  const contadorId = useRef(0);
  const refCaja = useRef(null);
  const refFin = useRef(null);

  useEffect(() => {
    refCaja.current?.focus();
  }, []);

  useEffect(() => {
    refFin.current?.scrollIntoView({ block: 'end' });
  }, [mensajes, escribiendo]);

  const nuevoId = () => {
    contadorId.current += 1;
    return contadorId.current;
  };

  const enviar = async (valor) => {
    if (enviandoRef.current || escribiendo) return;
    if (esMensajeVacio(valor)) return;

    enviandoRef.current = true;
    setMensajes((actuales) => [...actuales, crearMensaje(valor, 'usuario', nuevoId())]);
    setTexto('');
    setEscribiendo(true);

    try {
      const respuesta = await enviarMensajeChat(valor);
      setMensajes((actuales) => [
        ...actuales,
        crearMensaje(respuesta, 'asistente', nuevoId()),
      ]);
    } finally {
      enviandoRef.current = false;
      setEscribiendo(false);
    }
  };

  const onTecla = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar(texto);
    }
  };

  const estadoVacio = mensajes.length === 0 && !escribiendo;

  return (
    <>
      <h1 className="font-title text-2xl sm:text-3xl font-bold text-white mb-4">
        Chat de One Piece
      </h1>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {estadoVacio ? (
            <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
              <p className="text-white text-lg max-w-xl">
                ¡Hola! Soy tu asistente de One Piece. ¿Sobre qué quieres preguntar?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {SUGERENCIAS.map((sugerencia) => (
                  <button
                    key={sugerencia}
                    type="button"
                    onClick={() => enviar(sugerencia)}
                    className="bg-white/10 hover:bg-white/15 text-white rounded-full px-4 py-2 text-sm"
                  >
                    {sugerencia}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ListaMensajes mensajes={mensajes} escribiendo={escribiendo} refFin={refFin} />
          )}
        </div>
      </div>

      <CajaMensaje
        valor={texto}
        onCambio={setTexto}
        onEnviar={enviar}
        onTecla={onTecla}
        deshabilitado={escribiendo}
        refCaja={refCaja}
      />
    </>
  );
}
