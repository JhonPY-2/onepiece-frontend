'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

function obtenerSaludo() {
  try {
    const hora = Number(
      new Intl.DateTimeFormat('es-CO', {
        timeZone: 'America/Bogota',
        hour: 'numeric',
        hour12: false
      }).format(new Date())
    );
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  } catch {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, estaAutenticado, username } = useAuth();
  const personajesActivo = (pathname === '/' || pathname?.startsWith('/personajes')) ?? false;
  const deportesActivo = pathname?.startsWith('/deportes') ?? false;
  const estadisticasActivo = pathname?.startsWith('/estadisticas') ?? false;
  const nombreMostrado = username || 'Usuario';
  const inicial = nombreMostrado.charAt(0).toUpperCase();

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    router.push('/login');
  }

  return (
    <aside className="w-60 h-screen bg-[#081428] shrink-0 sticky top-0 flex flex-col">
      <Image
        src="/logo.png"
        alt="Logo One Piece"
        width={56}
        height={56}
        className="rounded-full object-cover mx-auto mt-6"
      />
      <nav className="mt-6 flex flex-col gap-1 px-4">
        <Link
          href="/"
          className={`text-white text-base px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            personajesActivo ? 'bg-gold/15' : 'bg-transparent'
          }`}
        >
          🏴‍☠️ Personajes
        </Link>
        <Link
          href="/deportes"
          className={`text-white text-base px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            deportesActivo ? 'bg-gold/15' : 'bg-transparent'
          }`}
        >
          ⚙️ Deportes
        </Link>
        <Link
          href="/estadisticas"
          className={`text-white text-base px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            estadisticasActivo ? 'bg-gold/15' : 'bg-transparent'
          }`}
        >
          📊 Estadísticas
        </Link>
      </nav>
      {estaAutenticado ? (
        <div className="mt-auto px-4 pb-8 flex flex-col gap-4">
          <div className="px-2">
            <p className="text-white text-base font-semibold">{obtenerSaludo()}, {nombreMostrado}</p>
            <p className="text-gray-400 text-sm">¡Sesión activa!</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center font-bold shrink-0">
              {inicial}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {nombreMostrado}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Activo
              </p>
            </div>
          </div>
          {!username && (
            <Link
              href="/completar-perfil"
              className="border border-gold/50 text-gold text-sm font-semibold px-4 py-2 rounded-lg text-center"
            >
              Completa tu perfil →
            </Link>
          )}
          <button
            onClick={cerrarSesion}
            className="bg-gold text-white font-semibold px-4 py-2 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <nav className="mt-auto flex flex-col gap-1 px-4 pb-8">
          <Link
            href="/login"
            className="text-white/80 text-base px-4 py-3 rounded-lg flex items-center gap-2 bg-transparent hover:bg-white/5"
          >
            🔐 Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="text-white/80 text-base px-4 py-3 rounded-lg flex items-center gap-2 bg-transparent hover:bg-white/5"
          >
            📝 Crear cuenta
          </Link>
        </nav>
      )}
    </aside>
  );
}