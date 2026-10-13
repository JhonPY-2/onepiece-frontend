export default function CajaMensaje({ valor, onCambio, refCaja }) {
  return (
    <div className="max-w-3xl w-full mx-auto pt-4 flex items-end gap-3">
      <textarea
        ref={refCaja}
        id="mensaje-chat"
        name="mensaje"
        rows={1}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        placeholder="Escribe tu mensaje…"
        aria-label="Escribe tu mensaje"
        className="flex-1 bg-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:bg-white/15 leading-6 resize-none"
      />
      <button
        type="button"
        className="bg-gold text-white font-semibold px-5 py-3 rounded-2xl shrink-0"
      >
        Enviar
      </button>
    </div>
  );
}
