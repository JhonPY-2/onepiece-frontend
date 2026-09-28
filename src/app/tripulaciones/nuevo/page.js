'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import SelectorImagen from '@/components/SelectorImagen';
import { API_URL } from '@/lib/api';

export default function NuevaTripulacion() {
  const router = useRouter();
  const { token, estaAutenticado } = useAuth();

  useEffect(() => {
    if (!estaAutenticado) {
      router.replace('/acceso-denegado');
    }
  }, [estaAutenticado, router]);

  const [formulario, setFormulario] = useState({
    nombre: '',
    capitan: '',
    descripcion: '',
    numeroMiembros: ''
  });

  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [archivoFotoCapitan, setArchivoFotoCapitan] = useState(null);
  const [fotoCapitanPreview, setFotoCapitanPreview] = useState(null);

  function manejarArchivoImagen(seleccionado) {
    setArchivoImagen(seleccionado);
    if (seleccionado) {
      setImagenPreview(URL.createObjectURL(seleccionado));
    } else {
      setImagenPreview(null);
    }
  }

  function manejarFotoCapitan(seleccionado) {
    setArchivoFotoCapitan(seleccionado);
    if (seleccionado) {
      setFotoCapitanPreview(URL.createObjectURL(seleccionado));
    } else {
      setFotoCapitanPreview(null);
    }
  }

  function manejarCambio(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value
    });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nombre', formulario.nombre);
      formData.append('capitan', formulario.capitan);
      formData.append('descripcion', formulario.descripcion);
      formData.append('numeroMiembros', formulario.numeroMiembros);
      if (archivoImagen) {
        formData.append('imagen', archivoImagen);
      }
      if (archivoFotoCapitan) {
        formData.append('fotoCapitan', archivoFotoCapitan);
      }

      const respuesta = await fetch(`${API_URL}/tripulaciones`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!respuesta.ok) {
        if (respuesta.status === 413) {
          const datosError = await respuesta.json();
          throw new Error(datosError?.mensaje ?? 'La imagen no puede superar los 5MB');
        }
        throw new Error('No se pudo crear la tripulación');
      }

      router.push('/tripulaciones');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (!estaAutenticado) {
    return <main className="min-h-screen bg-navy" />;
  }

  return (
    <main className="min-h-screen bg-navy p-8">
      <h1 className="font-title text-3xl font-bold text-white mb-8">Nueva Tripulación</h1>

      <div className="flex flex-col md:flex-row items-start gap-8">
        <form onSubmit={manejarEnvio} className="space-y-4 w-full max-w-md">
          <div>
            <label className="block text-gray-300 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ej. Piratas del Sombrero de Paja"
              required
              className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Capitán</label>
            <input
              type="text"
              name="capitan"
              value={formulario.capitan}
              onChange={manejarCambio}
              placeholder="Ej. Monkey D. Luffy"
              required
              className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Ej. Tripulación que sueña con el One Piece"
              className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Número de miembros</label>
            <input
              type="number"
              name="numeroMiembros"
              value={formulario.numeroMiembros}
              onChange={manejarCambio}
              placeholder="Ej. 10"
              min="0"
              className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <div className="flex items-center gap-6 pt-2">
            <button
              type="submit"
              disabled={enviando}
              className="bg-gold text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-secondary hover:text-gray-300 px-2 py-2"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-8">
          <div>
            <p className="text-gray-300 mb-2">Bandera / Emblema</p>
            <SelectorImagen preview={imagenPreview} onSeleccionar={manejarArchivoImagen} />
          </div>
          <div>
            <p className="text-gray-300 mb-2">Foto del capitán</p>
            <SelectorImagen preview={fotoCapitanPreview} onSeleccionar={manejarFotoCapitan} />
          </div>
        </div>
      </div>
    </main>
  );
}