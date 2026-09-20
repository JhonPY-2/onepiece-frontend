'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Registro() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await fetch('http://localhost:3000/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.message || 'No se pudo crear la cuenta');
      }

      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      router.replace('/login');
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
        <h1 className="font-title font-bold text-ink text-xl text-center">
          Crear cuenta
        </h1>

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

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="Email"
            required
            className={`bg-surface-alt rounded-lg h-12 pl-4 w-full text-ink placeholder-secondary outline-none focus:ring-2 focus:ring-gold border-2 ${error ? 'border-[#DC2626]' : 'border-transparent'}`}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder="Contraseña"
            required
            className={`bg-surface-alt rounded-lg h-12 pl-4 w-full text-ink placeholder-secondary outline-none focus:ring-2 focus:ring-gold border-2 ${error ? 'border-[#DC2626]' : 'border-transparent'}`}
          />

          <input
            type="password"
            value={confirmar}
            onChange={(e) => {
              setConfirmar(e.target.value);
              setError(null);
            }}
            placeholder="Confirmar contraseña"
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
            {enviando ? 'Cargando...' : 'Crear cuenta'}
          </button>

          {error && <p className="text-[#DC2626] text-sm">{error}</p>}
        </form>

        <p className="text-xs text-secondary text-center">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-gold">
            Inicia sesión
          </Link>
        </p>
      </div>

      <Link href="/" className="text-xs text-secondary hover:text-gray-300">
        ← Volver al inicio
      </Link>
    </main>
  );
}