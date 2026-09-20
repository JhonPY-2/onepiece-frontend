'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import useAuth from '@/hooks/useAuth';
import ModalConfirmarBorrado from '@/components/ModalConfirmarBorrado';

export default function BotonesAccion({ id }) {
  const router = useRouter();
  const { token, estaAutenticado } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);

  if (!estaAutenticado) return null;

  async function manejarEliminar() {
    try {
      const respuesta = await fetch(`http://localhost:3000/personajes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo borrar el personaje');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setModalAbierto(false);
    }
  }

  return (
    <>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => router.push(`/personajes/${id}/editar`)}
          className="bg-gold text-white px-6 py-2 rounded-lg font-semibold"
        >
          Editar
        </button>
        <button
          onClick={() => setModalAbierto(true)}
          className="border border-secondary text-secondary px-6 py-2 rounded-lg font-semibold bg-transparent"
        >
          Borrar
        </button>
      </div>

      <ModalConfirmarBorrado
        abierto={modalAbierto}
        entidad="personaje"
        onCancelar={() => setModalAbierto(false)}
        onConfirmar={manejarEliminar}
      />
    </>
  );
}