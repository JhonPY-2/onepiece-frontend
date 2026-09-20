'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CompletarPerfil() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
    }
  }, [router]);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch('http://localhost:3000/auth/completar-perfil', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.message || 'No se pudo completar el perfil');
      }

      localStorage.setItem('username', data.usuario?.username ?? '');
      router.replace('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center gap-6 p-8">
      <Image
        src="/logo.png"
        alt="Logo One Piece"
        width={64}
        height={64}
        className="rounded-full object-cover"
      />

      <div className="bg-white rounded-2xl w-[400px] p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-title font-bold text-ink text-xl text-center">
            Completa tu perfil
          </h1>
          <p className="text-secondary text-sm text-center">
            Necesitamos un dato más para continuar
          </p>
        </div>

        <form onSubmit={manejarEnvio} className="flex flex-col gap-6">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(null);
            }}
            placeholder="Usuario"
            required
            className={`bg-surface-alt rounded-lg h-12 pl-4 w-full text-ink placeholder-secondary outline-none focus:ring-2 focus:ring-gold border-2 ${error ? 'border-[#DC2626]' : 'border-transparent'}`}
          />

          <button
            type="submit"
            disabled={enviando}
            className="bg-gold text-white font-semibold rounded-lg h-12 w-full disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {enviando && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {enviando ? 'Cargando...' : 'Continuar'}
          </button>

          {error && <p className="text-[#DC2626] text-sm">{error}</p>}
        </form>
      </div>

      <button onClick={() => router.replace('/')} className="text-xs text-secondary hover:text-gray-300">
        ← Volver al inicio
      </button>
    </main>
  );
}