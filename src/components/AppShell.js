'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const RUTAS_SIN_SIDEBAR = ['/login', '/registro', '/acceso-denegado', '/completar-perfil'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const ocultarSidebar = RUTAS_SIN_SIDEBAR.some((ruta) => pathname?.startsWith(ruta));

  if (ocultarSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}