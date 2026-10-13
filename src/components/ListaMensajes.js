export default function ListaMensajes({ mensajes, escribiendo, refFin }) {
  return (
    <div className="space-y-4">
      {mensajes.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.autor === 'usuario' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] px-4 py-2 rounded-2xl break-words ${
              m.autor === 'usuario' ? 'bg-gold text-white' : 'bg-white/10 text-white'
            }`}
          >
            {m.texto}
          </div>
        </div>
      ))}

      {escribiendo && (
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-white/10 text-white">
            escribiendo…
          </div>
        </div>
      )}

      <div ref={refFin} />
    </div>
  );
}
