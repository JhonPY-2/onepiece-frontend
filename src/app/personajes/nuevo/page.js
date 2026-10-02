'use client';


import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import useAuth from "@/hooks/useAuth";
import SelectorImagen from '@/components/SelectorImagen';
import InputEtiquetas from '@/components/InputEtiquetas';
import { API_URL } from '@/lib/api';



export default function NuevoPersonaje() {
   

        const router = useRouter();
        const { token, estaAutenticado } = useAuth();
        const [tripulaciones, setTripulaciones] = useState([]);

        useEffect(() => {
            if (!estaAutenticado) {
                router.replace('/acceso-denegado');
            }
        }, [estaAutenticado, router]);

        useEffect(() => {
            async function cargarTripulaciones() {
                try {
                    const respuesta = await fetch(`${API_URL}/tripulaciones`);
                    if (respuesta.ok) {
                        setTripulaciones(await respuesta.json());
                    }
                } catch {
                    setTripulaciones([]);
                }
            }
            cargarTripulaciones();
        }, []);


        const [formulario, setFormulario] = useState ({

            nombre: '',
            tripulacion: '',
            recompensa: '',
            frutaNombre: '',
            frutaTipo: '',
            frutaDespertada: false
        })

        const [habilidades, setHabilidades] = useState([]);
        const [arcos, setArcos] = useState([]);


       const [error, setError] = useState(null);
       const [enviando, setEnviando] = useState(false)
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

        const { name, type, value, checked } = evento.target;

        setFormulario({

            ...formulario,
            [name]: type === 'checkbox' ? checked : value

        });
       }


       async function manejarEnvio(evento) {

        evento.preventDefault();
        setEnviando(true);
        setError(null)

       

  try {
      const formData = new FormData();
      formData.append('nombre', formulario.nombre);
      formData.append('tripulacion', formulario.tripulacion);
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

      const respuesta = await fetch(`${API_URL}/personajes`, {
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
        throw new Error('No se pudo crear el personaje');
      }

      router.push('/');
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
      <h1 className="font-title text-3xl font-bold text-white mb-8">Nuevo Personaje</h1>

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
              placeholder="Ej. Monkey D. Luffy"
              className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Tripulación</label>
            <select
              name="tripulacion"
              value={formulario.tripulacion}
              onChange={manejarCambio}
              required
              className="bg-white rounded-lg p-2.5 w-full text-ink outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="" disabled>
                Selecciona una tripulación
              </option>
              {tripulaciones.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Recompensa</label>
            <input
              type="number"
              name="recompensa"
              value={formulario.recompensa}
              onChange={manejarCambio}
              placeholder="Ej. 3000000000"
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