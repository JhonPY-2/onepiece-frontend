'use client';

export default function ModalConfirmarBorrado({ abierto, entidad, onCancelar, onConfirmar }) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-[400px] p-8 flex flex-col gap-6">
        <h2 className="font-title font-bold text-ink text-xl text-center">
          ¿Eliminar este {entidad}?
        </h2>
        <p className="text-secondary text-sm text-center">
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancelar}
            className="border border-secondary text-secondary rounded-lg h-12 w-full font-semibold bg-transparent"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="bg-[#DC2626] text-white font-bold rounded-lg h-12 w-full"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}