import Link from 'next/link';
import Image from 'next/image';

export default function AccesoDenegado() {
  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center gap-6 p-8">
      <Image
        src="/logo.png"
        alt="Logo One Piece"
        width={64}
        height={64}
        className="rounded-full object-cover"
      />

      <div className="bg-white rounded-2xl w-[400px] p-8 flex flex-col gap-6 items-center">
        <span className="text-5xl">🔒</span>
        <h1 className="font-title font-bold text-ink text-xl text-center">
          Acceso denegado
        </h1>
        <p className="text-secondary text-sm text-center">
          Necesitas iniciar sesión para realizar esta acción.
        </p>
        <Link
          href="/login"
          className="bg-gold text-white font-semibold rounded-lg h-12 w-full flex items-center justify-center"
        >
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}