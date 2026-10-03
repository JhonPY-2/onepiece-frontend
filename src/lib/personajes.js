const resplandores = [
  { clave: 'luffy', color: '#D4A034' },
  { clave: 'zoro', color: '#4A7C59' },
  { clave: 'nami', color: '#E8964A' },
  { clave: 'robin', color: '#8B6FB0' },
  { clave: 'sanji', color: '#4A6FA5' },
  { clave: 'chopper', color: '#E89BAF' },
];

export const resplandorPorNombre = (nombre) => {
  const nombreMinuscula = nombre?.toLowerCase() ?? '';
  return resplandores.find((r) => nombreMinuscula.includes(r.clave))?.color ?? '#D4A034';
};

// Mapeo nombre -> archivo de imagen en /public
// Si el personaje no tiene imagen propia todavía, cae en el logo como placeholder
const imagenes = [
  { clave: 'luffy', archivo: '/luffy.png' },
  { clave: 'zoro', archivo: '/zoro.png' },
  { clave: 'nami', archivo: '/nami.png' },
  { clave: 'robin', archivo: '/robin.png' },
  { clave: 'sanji', archivo: '/sanji2.png' },
  { clave: 'chopper', archivo: '/chopper.png' },
];

export const imagenPorNombre = (nombre) => {
  const nombreMinuscula = nombre?.toLowerCase() ?? '';
  return imagenes.find((i) => nombreMinuscula.includes(i.clave))?.archivo ?? '/logo.png';
};

export const imagenDe = (personaje) => {
  if (personaje?.imagen && String(personaje.imagen).startsWith('http')) {
    return personaje.imagen.replace('/upload/', '/upload/f_auto,q_auto,w_400/');
  }
  if (personaje?.imagen) {
    return `/${personaje.imagen}`;
  }
  return imagenPorNombre(personaje?.nombre);
};