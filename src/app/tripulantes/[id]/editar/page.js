'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import SelectorImagen from '@/components/SelectorImagen';
import InputEtiquetas from '@/components/InputEtiquetas';
import { API_URL } from '@/lib/api';

export default function EditarTripulante({ params }) {
  const router = useRouter();
  const { token, estaAutenticado } = useAuth();
  const [id, setId] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: '',
    recompensa: '',
    frutaNombre: '',
    frutaTipo: '',
    frutaDespertada: false
  });

  const [habilidades, setHabilidades] = useState([]);
  const [arcos, setArcos] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [tripulacionId, setTripulacionId] = useState('');
  const [tripulacionNombre, setTripulacionNombre] = useState('');

  function manejarArchivo(seleccionado) {
    setArchivo(seleccionado);
    if (seleccionado) {
      setImagenPreview(URL.createObjectURL(seleccionado));
    } else {
      setImagenPreview(null);
    }
  }

  useEffect(() => {
    if (!estaAutenticado) {
      router.replace('/acceso-denegado');
    }
  }, [estaAutenticado, router]);

  useEffect(() => {
    async function cargarDatos() {
      const { id } = await params;
      setId(id);

      const respuesta = await fetch(`${API_URL}/tripulantes/${id}`);
      const datos = await respuesta.json();

      setFormulario({
        nombre: datos.nombre,
        recompensa: datos.recompensa,
        frutaNombre: datos.frutaDiablo?.nombre ?? '',
        frutaTipo: datos.frutaDiablo?.tipo ?? '',
        frutaDespertada: datos.frutaDiablo?.despertada ?? false
      });

      setHabilidades(datos.habilidades ?? []);
      setArcos(datos.arcos ?? []);

      setTripulacionId(datos.tripulacion?._id ?? datos.tripulacion ?? '');
      setTripulacionNombre(datos.tripulacion?.nombre ?? '');

      if (datos.imagen && String(datos.imagen).startsWith('http')) {
        setImagenPreview(datos.imagen);
      }

      setCargando(false);
    }

    cargarDatos();
  }, [params]);

  function manejarCambio(evento) {
    const { name, type, value, checked } = evento.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nombre', formulario.nombre);
      formData.append('tripulacion', tripulacionId);
      formData.append('recompensa', formulario.recompensa || '0');
      formData.append(
        'frutaDiablo',
        JSON.stringify({
          nombre: formulario.frutaNombre,
          tipo: formulario.frutaTipo,
          despertada: formulario.frutaDespertada
        })
      );
      formData.append('habilidades', JSON.stringify(habilidades));
      formData.append('arcos', JSON.stringify(arcos));
      if (archivo) {
        formData.append('imagen', archivo);
      }

      const respuesta = await fetch(`${API_URL}/tripulantes/${id}`, {
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
        throw new Error('No se pudo actualizar el tripulante');
      }

      router.push(`/tripulantes/${id}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return <main className="min-h-screen bg-navy p-8">Cargando...</main>;
  }

  if (!estaAutenticado) {
    return <main className="min-h-screen bg-navy" />;
  }

  return (
    <main className="min-h-screen bg-navy p-8">
      <h1 className="font-title text-3xl font-bold text-white mb-8">Editar Tripulante</h1>

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
            <label className="block text-gray-300 mb-1">Tripulación</label>
            <p className="bg-white rounded-lg p-2.5 w-full text-ink">
              {tripulacionNombre || '—'}
            </p>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Recompensa</label>
            <input
              type="number"
              name="recompensa"
              value={formulario.recompensa}
              onChange={manejarCambio}
              className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Fruta del Diablo</label>
            <input
              type="text"
              name="frutaNombre"
              value={formulario.frutaNombre}
              onChange={manejarCambio}
              placeholder="Nombre de la fruta"
              className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold mb-2"
            />
            <select
              name="frutaTipo"
              value={formulario.frutaTipo}
              onChange={manejarCambio}
              className="bg-white rounded-lg p-2.5 w-full text-ink outline-none focus:ring-2 focus:ring-gold mb-2"
            >
              <option value="">Sin tipo</option>
              <option value="Paramecia">Paramecia</option>
              <option value="Zoan">Zoan</option>
              <option value="Logia">Logia</option>
              <option value="Zoan Ancestral">Zoan Ancestral</option>
              <option value="Zoan Mítica">Zoan Mítica</option>
            </select>
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="frutaDespertada"
                checked={formulario.frutaDespertada}
                onChange={manejarCambio}
                className="w-4 h-4 accent-gold"
              />
              Despertada
            </label>
          </div>

          <InputEtiquetas
            etiqueta="Habilidades"
            valores={habilidades}
            onChange={setHabilidades}
            placeholder="Ej. Gear 5"
          />

          <InputEtiquetas
            etiqueta="Arcos"
            valores={arcos}
            onChange={setArcos}
            placeholder="Ej. Wano"
          />

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
    </main>
  );
}