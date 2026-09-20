'use client';

import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

export default function BotonAgregar({ href, children }) {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) return null;

  return (
    <Link
      href={href}
      className="bg-gold text-white font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
    >
      {children}
    </Link>
  );
}