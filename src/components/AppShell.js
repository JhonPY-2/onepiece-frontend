'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const RUTAS_SIN_SIDEBAR = ['/login', '/registro', '/acceso-denegado', '/completar-perfil'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const ocultarSidebar = RUTAS_SIN_SIDEBAR.some((ruta) => pathname?.startsWith(ruta));

  useEffect(() => {
    // Cerrar drawer al cambiar de ruta (patrón estándar para drawers/modal)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuAbierto(false);
  }, [pathname]);

  if (ocultarSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <button
        type="button"
        onClick={() => setMenuAbierto((abierto) => !abierto)}
        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuAbierto}
        className="fixed top-4 left-4 z-[60] md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gold text-white text-xl leading-none"
      >
        {menuAbierto ? '×' : '☰'}
      </button>

      <Sidebar abierto={menuAbierto} />

      {menuAbierto && <div onClick={() => setMenuAbierto(false)} className="fixed inset-0 z-30 bg-black/50 md:hidden" />}

      <div className="flex-1 min-w-0 pt-16 md:pt-0">{children}</div>
    </div>
  );
}