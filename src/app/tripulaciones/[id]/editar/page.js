'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import SelectorImagen from '@/components/SelectorImagen';
import { API_URL } from '@/lib/api';

export default function EditarTripulacion() {
  const router = useRouter();
  const { id } = useParams();
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

  const [cargando, setCargando] = useState(true);
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

  useEffect(() => {
    async function cargarTripulacion() {
      try {
        const respuesta = await fetch(`${API_URL}/tripulaciones`);
        if (!respuesta.ok) {
          throw new Error('No se pudo cargar la tripulación');
        }
        const tripulaciones = await respuesta.json();
        const dato = tripulaciones.find((t) => t._id === id);

        if (!dato) {
          throw new Error('No se pudo cargar la tripulación');
        }

        setFormulario({
          nombre: dato.nombre || '',
          capitan: dato.capitan || '',
          descripcion: dato.descripcion || '',
          numeroMiembros: dato.numeroMiembros ?? ''
        });

        if (dato.imagen && String(dato.imagen).startsWith('http')) {
          setImagenPreview(dato.imagen);
        }
        if (dato.fotoCapitan && String(dato.fotoCapitan).startsWith('http')) {
          setFotoCapitanPreview(dato.fotoCapitan);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargarTripulacion();
  }, [id]);

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

      const respuesta = await fetch(`${API_URL}/tripulaciones/${id}`, {
        method: 'PUT',
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
        throw new Error('No se pudo editar la tripulación');
      }

      router.push(`/tripulaciones/${id}`);
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
      <h1 className="font-title text-3xl font-bold text-white mb-8">Editar Tripulación</h1>

      {cargando ? (
        <p className="text-gray-300">Cargando tripulación...</p>
      ) : (
        <div className="flex flex-col md:flex-row items-start gap-8">
          <form onSubmit={manejarEnvio} className="space-y-4 w-full max-w-md">
            <div>
              <label className="block text-gray-300 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
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
      )}
    </main>
  );
}