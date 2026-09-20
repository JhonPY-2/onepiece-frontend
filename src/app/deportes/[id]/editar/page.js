'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import SelectorImagen from '@/components/SelectorImagen';

const poolHabilidades = ['Velocidad', 'Fuerza', 'Defensa', 'Agilidad', 'Técnica', 'Resistencia', 'Potencia'];

export default function EditarDeporte() {
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
    equipo: '',
    logros: '',
    posicion: ''
  });

  const [estadisticas, setEstadisticas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  function manejarArchivo(seleccionado) {
    setArchivo(seleccionado);
    if (seleccionado) {
      setImagenPreview(URL.createObjectURL(seleccionado));
    } else {
      setImagenPreview(null);
    }
  }

  function manejarCambio(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value
    });
  }

  function agregarEstadistica() {
    const siguiente = poolHabilidades.find((h) => !estadisticas.includes(h));
    if (siguiente) {
      setEstadisticas([...estadisticas, siguiente]);
    }
  }

  function quitarEstadistica(indice) {
    setEstadisticas(estadisticas.filter((_, i) => i !== indice));
  }

  useEffect(() => {
    async function cargarAtleta() {
      try {
        const respuesta = await fetch(`http://localhost:3000/atletas/${id}`);
        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el atleta');
        }
        const dato = await respuesta.json();
        setFormulario({
          nombre: dato.nombre || '',
          equipo: dato.equipo || '',
          logros: dato.logros || '',
          posicion: dato.posicion || ''
        });
        setEstadisticas(dato.estadisticas || []);

        if (dato.imagen && String(dato.imagen).startsWith('http')) {
          setImagenPreview(dato.imagen);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargarAtleta();
  }, [id]);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nombre', formulario.nombre);
      formData.append('equipo', formulario.equipo);
      formData.append('logros', formulario.logros);
      formData.append('posicion', formulario.posicion);
      estadisticas.forEach((est) => formData.append('estadisticas', est));
      if (archivo) {
        formData.append('imagen', archivo);
      }

      const respuesta = await fetch(`http://localhost:3000/atletas/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo editar el atleta');
      }

      router.push(`/deportes/${id}`);
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
      <h1 className="font-title text-3xl font-bold text-white mb-8">Editar Atleta</h1>

      {cargando ? (
        <p className="text-gray-300">Cargando atleta...</p>
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
              <label className="block text-gray-300 mb-1">Equipo</label>
              <input
                type="text"
                name="equipo"
                value={formulario.equipo}
                onChange={manejarCambio}
                required
                className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Logros</label>
              <input
                type="text"
                name="logros"
                value={formulario.logros}
                onChange={manejarCambio}
                className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Posición</label>
              <input
                type="text"
                name="posicion"
                value={formulario.posicion}
                onChange={manejarCambio}
                className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Estadísticas</label>
              <div className="flex flex-wrap items-center gap-2">
                {estadisticas.map((est, i) => (
                  <span
                    key={`${est}-${i}`}
                    className="inline-flex items-center gap-1 bg-skill text-white text-sm rounded-full px-3 py-1"
                  >
                    {est}
                    <button
                      type="button"
                      onClick={() => quitarEstadistica(i)}
                      className="ml-1 text-gray-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={agregarEstadistica}
                  className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-sm font-bold shrink-0"
                >
                  +
                </button>
              </div>
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

          <SelectorImagen preview={imagenPreview} onSeleccionar={manejarArchivo} />
        </div>
      )}
    </main>
  );
}