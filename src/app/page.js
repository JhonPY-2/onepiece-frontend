import ListaPersonajes from '@/app/ListaPersonajes';
import { API_URL } from '@/lib/api';

async function obtenerPersonajes() {
  const respuesta = await fetch(`${API_URL}/personajes`, {
    cache: 'no-store'
  });
  const datos = await respuesta.json();
  return datos;
}

// Los documentos de Mongoose no se pueden enviar tal cual a un Client Component
// (_id es un ObjectId y la tripulacion viene poblada), asi que se aplanan.
const aObjetoPlano = (personaje) => ({
  _id: String(personaje._id),
  nombre: personaje.nombre,
  imagen: personaje.imagen,
  tripulacionNombre: personaje.tripulacion?.nombre ?? ''
});

export default async function Home() {
  const personajes = await obtenerPersonajes();

  return (
    <main className="min-h-screen bg-navy p-8">
      <ListaPersonajes personajes={personajes.map(aObjetoPlano)} />
    </main>
  );
}