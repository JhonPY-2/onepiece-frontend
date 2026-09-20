'use client';


import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import useAuth from "@/hooks/useAuth";
import SelectorImagen from '@/components/SelectorImagen';



export default function NuevoPersonaje() {
   

        const router = useRouter();
        const { token, estaAutenticado } = useAuth();

        useEffect(() => {
            if (!estaAutenticado) {
                router.replace('/acceso-denegado');
            }
        }, [estaAutenticado, router]);


        const [formulario, setFormulario] = useState ({

            nombre: '',
            tripulacion: '',
            recompensa: ''
        })


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

        setFormulario({

            ...formulario,
            [evento.target.name]: evento.target.value 

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
      if (archivo) {
        formData.append('imagen', archivo);
      }

      const respuesta = await fetch('http://localhost:3000/personajes', {
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
            <input
              type="text"
              name="tripulacion"
              value={formulario.tripulacion}
              onChange={manejarCambio}
              required
              placeholder="Ej. Sombrero de Paja"
              className="bg-white rounded-lg p-2.5 w-full text-ink placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
            />
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